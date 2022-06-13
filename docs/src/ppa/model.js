import * as odex from "odex";
import * as math from "mathjs";


export class Model {
    constructor(inp) {
        this.Location = inp.Location;
        this.Pars = inp.Pars;
        this.Tar = inp.Tars;
        this.Y0 = this._simY0(this.Pars);
    }

    _get_epi_fn(p) {
        const i = {
            U: 0,
            A: 1, S: 2, C: 3,
            E_Pub: 4, E_Eng: 5, E_Pri: 6,
            Tx_Pub: 7, Tx_Eng: 8, Tx_Pri: 9,
            Lf: 10, Ls: 11,
            R_TC: 12, R_TD: 13, R_St: 14
        };

        return function(t, y) {
            const dy = math.zeros(15)._data;
            const adj = (t > 2010)? math.exp(-0.01 * (t - 2010)): 1;

            let temp;

            // Birth, death
            let bir = 0, dea
            dea = (p.R_Die + p.R_Die_Asym) * y[i.A];
            dy[i.A] -= dea;
            bir += dea;

            for (let j = i.S; j <= i.E_Pri; j++) {
                dea = (p.R_Die + p.R_Die_Sym) * y[j];
                dy[j] -= dea;
                bir += dea;
            }
            for (let j = 0; j < 3; j++) {
                dea = (p.R_Die + p.R_Die_Tx[j]) * y[i.Tx_Pub + j];
                dy[i.Tx_Pub + j] -= dea;
                bir += dea;
            }
            for (let j = i.Lf; j <= i.R_St; j++) {
                dea = p.R_Die * y[j];
                dy[j] -= dea;
                bir += dea;
            }
            dy[i.U] += bir

            // Transmission
            let foi = (y[i.A] + y[i.S] + y[i.C] + y[i.E_Pub] + y[i.E_Eng] + y[i.E_Pri]) * p.beta * adj, infection = 0;

            temp = foi * y[i.U];
            dy[i.U] -= temp;
            infection += temp;

            for (let j = i.Ls; j <= i.R_St; j++) {
                temp = (1 - p.P_Im) * foi * y[j];
                dy[j] -= temp;
                infection += temp;
            }
            dy[i.Lf] += infection;

            // Progression, Care-seeking
            dy[i.A] += p.R_Act * y[i.Lf] + p.R_React * y[i.Ls] + p.R_Rel_ST * y[i.R_St]  + p.R_Rel_TD * y[i.R_TD] + p.R_Rel_TC * y[i.R_TC];
            dy[i.A] -= (p.R_Onset + p.R_SelfCure) * y[i.A];
            dy[i.S] += p.R_Onset * y[i.A] - (p.R_Aware + p.R_SelfCure) * y[i.S];
            dy[i.C] += p.R_Aware * y[i.S] - p.R_SelfCure * y[i.C];
            dy[i.E_Pub] += - p.R_SelfCure * y[i.E_Pub];
            dy[i.E_Eng] += - p.R_SelfCure * y[i.E_Eng];
            dy[i.E_Pri] += - p.R_SelfCure * y[i.E_Pri];

            dy[i.Tx_Pub] += - (p.R_Succ_Tx[0] + p.R_LTFU_Tx[0]) * y[i.Tx_Pub];
            dy[i.Tx_Eng] += - (p.R_Succ_Tx[1] + p.R_LTFU_Tx[1]) * y[i.Tx_Eng];
            dy[i.Tx_Pri] += - (p.R_Succ_Tx[2] + p.R_LTFU_Tx[2]) * y[i.Tx_Pri];

            dy[i.Lf] += - (p.R_Act + p.R_Stab) * y[i.Lf];
            dy[i.Ls] += p.R_Stab * y[i.Lf] + p.R_SelfCure * (y[i.A] + y[i.S] + y[i.C] + y[i.E_Pub] + y[i.E_Eng] + y[i.E_Pri]) - p.R_React * y[i.Ls];
            dy[i.R_TC] += p.R_Succ_Tx[0] * y[i.Tx_Pub] + p.R_Succ_Tx[1] * y[i.Tx_Eng] + p.R_Succ_Tx[2] * y[i.Tx_Pri] - (p.R_Stab + p.R_Rel_TC) * y[i.R_TC];
            dy[i.R_TD] += p.R_LTFU_Tx[0] * y[i.Tx_Pub] + p.R_LTFU_Tx[1] * y[i.Tx_Eng] + p.R_LTFU_Tx[2] * y[i.Tx_Pri] - (p.R_Stab + p.R_Rel_TD) * y[i.R_TD];
            dy[i.R_St] += p.R_Stab * (y[i.R_TC] + y[i.R_TD]) -  p.R_Rel_ST * y[i.R_St];

            dy[i.Lf] -= p.R_Clear * y[i.Lf];
            dy[i.Ls] -= p.R_Clear * y[i.Ls];
            dy[i.R_TC] -= p.R_Clear * y[i.R_TC];
            dy[i.R_TD] -= p.R_Clear * y[i.R_TD];
            dy[i.R_St] -= p.R_Clear * y[i.R_St];
            dy[i.U] += p.R_Clear * (y[i.Lf] + y[i.Ls] + y[i.R_TC] + y[i.R_TD] + y[i.R_St]);

            for (let to = 0; to < 3; to++) {
                let cs = p.R_CSI * p.P_Entry[to] * y[i.C];
                let det = cs * p.P_Dx0[to];
                dy[i.C] -= cs;
                dy[i.E_Pub + to] += cs * (1 - p.P_Dx0[to]);
                dy[i.Det0_Pub + to] += det

                for (let fr = 0; fr < 3; fr++) {
                    const tr = p.P_Tr[fr][to] * p.R_ReCSI * y[i.E_Pub + fr];
                    det += tr * p.P_Dx1[fr][to]
                    dy[i.E_Pub + fr] -= tr
                    dy[i.E_Pub + to] += tr * (1 - p.P_Dx1[fr][to])
                }

                dy[i.Det1_Pub + to] += det - dy[i.Det0_Pub + to]
                dy[i.Tx_Pub + to] += det * p.P_TxI[to];
                dy[i.R_TD] += det * (1 - p.P_TxI[to]);
            }
            return dy;
        }
    }

    _simY0() {
        const s = new odex.Solver(15);
        return s.solve(
            this._get_epi_fn(this.Pars),
            1700,
            [0.99, 0.01, 0, 0, 0,
                0, 0, 0, 0, 0,
                0, 0, 0, 0, 0],
            2022,
        ).y;
    }

    simCascade(pars) {
        const p = pars || this.Pars;
        const i = {
            A: 0,
            S: 1,
            C: 2,
            E_Pub: 3, E_Eng: 4, E_Pri: 5,
            Tx_Pub: 6, Tx_Eng: 7, Tx_Pri: 8,
            DieUt: 9,
            DieTx: 10,
            SelfCure: 11,
            Succ: 12,
            LTFU: 13,
            Det0_Pub: 14, Det0_Eng: 15, Det0_Pri: 16,
            Det1_Pub: 17, Det1_Eng: 18, Det1_Pri: 19
        }

        const fn = function(t, y) {
            const dy = [
                - (p.R_Onset + p.R_Die_Asym + p.R_SelfCure) * y[i.A],
                p.R_Onset * y[i.A] - (p.R_Aware + p.R_Die_Sym + p.R_SelfCure) * y[i.S],
                p.R_Aware * y[i.S] - (p.R_CSI + p.R_Die_Sym + p.R_SelfCure) * y[i.C],
                - (p.R_Die_Sym + p.R_SelfCure) * y[i.E_Pub],
                - (p.R_Die_Sym + p.R_SelfCure) * y[i.E_Eng],
                - (p.R_Die_Sym + p.R_SelfCure) * y[i.E_Pri],
                - (p.R_Succ_Tx[0] + p.R_Die_Tx[0] + p.R_LTFU_Tx[0]) * y[i.Tx_Pub],
                - (p.R_Succ_Tx[1] + p.R_Die_Tx[1] + p.R_LTFU_Tx[1]) * y[i.Tx_Eng],
                - (p.R_Succ_Tx[2] + p.R_Die_Tx[2] + p.R_LTFU_Tx[2]) * y[i.Tx_Pri],
                p.R_Die_Asym * y[i.A] + p.R_Die_Sym * (y[i.S] + y[i.C] + y[i.E_Pub] + y[i.E_Eng] + y[i.E_Pri]),
                p.R_Die_Tx[0] * y[i.Tx_Pub] + p.R_Die_Tx[1] * y[i.Tx_Eng] + p.R_Die_Tx[2] * y[i.Tx_Pri],
                p.R_SelfCure * (y[i.A] + y[i.S] + y[i.C] + y[i.E_Pub] + y[i.E_Eng] + y[i.E_Pri]),
                p.R_Succ_Tx[0] * y[i.Tx_Pub] + p.R_Succ_Tx[1] * y[i.Tx_Eng] + p.R_Succ_Tx[2] * y[i.Tx_Pri],
                p.R_LTFU_Tx[0] * y[i.Tx_Pub] + p.R_LTFU_Tx[1] * y[i.Tx_Eng] + p.R_LTFU_Tx[2] * y[i.Tx_Pri],
                0, 0, 0, 0, 0, 0
            ]

            for (let to = 0; to < 3; to++) {
                let cs = p.R_CSI * p.P_Entry[to] * y[i.C];
                let det = cs * p.P_Dx0[to];
                dy[i.E_Pub + to] += cs * (1 - p.P_Dx0[to]);
                dy[i.Det0_Pub + to] += det

                for (let fr = 0; fr < 3; fr++) {
                    const tr = p.P_Tr[fr][to] * p.R_ReCSI * y[i.E_Pub + fr];
                    det += tr * p.P_Dx1[fr][to]
                    dy[i.E_Pub + fr] -= tr
                    dy[i.E_Pub + to] += tr * (1 - p.P_Dx1[fr][to])
                }

                dy[i.Det1_Pub + to] += det - dy[i.Det0_Pub + to]
                dy[i.Tx_Pub + to] += det * p.P_TxI[to];
                dy[i.LTFU] += det * (1 - p.P_TxI[to]);
            }

            return dy;
        }

        const dur = [0, 0, 0, 0, 0, 0];
        const s = new odex.Solver(20);
        s.denseOutput = true;
        const end = s.solve(fn,
            0,
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            5,
            s.grid(0.01, function(x, y) {
                for (let j = 0; j < i.Tx_Pub; j++) {
                    dur[j] += y[j] * 0.01
                }
            })).y;

        const det0 = math.matrix([i.Det0_Pub, i.Det0_Eng, i.Det0_Pri].map(x => end[x])),
            det1 = math.matrix([i.Det1_Pub, i.Det1_Eng, i.Det1_Pri].map(x => end[x]));

        const cdr = (math.sum(det1) + math.sum(det0))

        return {
            CSI: p.P_Entry,
            Det: math.divide(math.add(det0, det1), cdr)._data,
            CDR: cdr,
            DurAsym: dur[i.A],
            DelayPat: dur[i.S] + dur[i.C],
            DelaySym: (dur[i.E_Pub] + dur[i.E_Eng] + dur[i.E_Pri]) * math.sum(det1) / cdr,
            DropSC: end[i.SelfCure],
            DropDie: end[i.DieUt],
            TxSucc: end[i.Succ] / (end[i.Succ] + end[i.DieTx] + end[i.LTFU]),
            TxLTFU: end[i.LTFU] / (end[i.Succ] + end[i.DieTx] + end[i.LTFU]),
            TxDie: end[i.DieTx] / (end[i.Succ] + end[i.DieTx] + end[i.LTFU])
        };
    }

    simEpi(pars) {
        const p = pars || this.Pars;
        const i = {
            U: 0,
            A: 1, S: 2, C: 3,
            E_Pub: 4, E_Eng: 5, E_Pri: 6,
            Tx_Pub: 7, Tx_Eng: 8, Tx_Pri: 9,
            Lf: 10, Ls: 11,
            R_TC: 12, R_TD: 13, R_St: 14
        };

        const mea = [];

        const s = new odex.Solver(15);
        s.denseOutput = true;
        s.solve(this._get_epi_fn(p), 2022, this.Y0, 2030, s.grid(0.5, function(t, y) {
            let dea = (p.R_Die + p.R_Die_Asym) * y[i.A];
            for (let j = i.S; j <= i.E_Pri; j++) {
                dea += (p.R_Die + p.R_Die_Sym) * y[j];
            }

            mea.push({
                'Time': t,
                'IncR': p.R_Act * y[i.Lf] + p.R_React * y[i.Ls] + p.R_Rel_ST * y[i.R_St]  + p.R_Rel_TD * y[i.R_TD] + p.R_Rel_TC * y[i.R_TC],
                'MorR': dea
            });
        }));

        return mea;

    }

    reform(intv) {
        const pars = this.Pars
        const pars_new = Object.assign({}, pars);

        if (intv.CS !== undefined) {
            const rr = (1 + intv.CS.Scale)
            pars_new.R_CSI = pars.R_CSI * rr;
            pars_new.R_ReCSI = pars.R_ReCSI * rr;
            pars_new.R_Aware = pars.R_Aware * rr;
        }
        if (intv.PPM !== undefined) {
            let pr = intv.PPM.Scale;
            pars_new.P_Entry = [pars.P_Entry[0], pars.P_Entry[1] + pars.P_Entry[2] * pr, pars.P_Entry[2] * (1 - pr)]

            pars_new.P_Tr = [
                [pars.P_Tr[0][0], pars.P_Tr[0][1] + pars.P_Tr[0][2] * pr, pars.P_Tr[0][2] * (1 - pr)],
                [pars.P_Tr[1][0], pars.P_Tr[1][1] + pars.P_Tr[1][2] * pr, pars.P_Tr[1][2] * (1 - pr)],
                [pars.P_Tr[2][0], pars.P_Tr[2][1] + pars.P_Tr[2][2] * pr, pars.P_Tr[2][2] * (1 - pr)]
            ]
        }

        if (intv.ImpDx !== undefined) {
            let pr = 1 - intv.ImpDx.Dx;
            pars_new.P_Dx0 = [1 - pr * (1 - pars.P_Dx0[0]), 1 - pr * (1 - pars.P_Dx0[1]), pars.P_Dx0[2]]

            pars_new.P_Dx1 = [
                [1 - pr * (1 - pars.P_Dx1[0][0]), 1 - pr * (1 - pars.P_Dx1[0][1]), pars.P_Dx1[0][2]],
                [1 - pr * (1 - pars.P_Dx1[1][0]), 1 - pr * (1 - pars.P_Dx1[1][1]), pars.P_Dx1[1][2]],
                [1 - pr * (1 - pars.P_Dx1[2][0]), 1 - pr * (1 - pars.P_Dx1[2][1]), pars.P_Dx1[2][2]]
            ]
        }
        return pars_new;
    }

    sim(intv) {
        let p = this.Pars;
        if (intv !== undefined) {
            p = this.reform(intv);
        }

        return {
            'Epi': this.simEpi(p),
            'Cas': this.simCascade(p)
        }
    }
}
