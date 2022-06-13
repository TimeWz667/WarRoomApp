const fs = require('fs');
var odex = require('odex');
var math = require('mathjs');


class Simulator {
    constructor(src) {
        this.Source = src;
        let p = src.Pars;
        p.R_Die = 1 /66;
        p.R_Act = 0.5 / 9;
        p.R_React = 0.001;
        p.R_Rel_TD = 0.1;
        p.R_Rel_TC = 0.01;
        p.R_Rel_ST = 0.002;
        p.R_Clear = 0.03;
        p.P_Im = 0.8;
        p.R_Stab = 0.5;
        this.isValid = false;
    }

    run(beta) {
        const i = {
            U: 0,
            A: 1, S: 2, C: 3,
            E_Pub: 4, E_Eng: 5, E_Pri: 6,
            Tx_Pub: 7, Tx_Eng: 8, Tx_Pri: 9,
            Lf: 10, Ls: 11,
            R_TC: 12, R_TD: 13, R_St: 14
        };
        const p = this.Source.Pars;
        const full = (p.beta !== undefined);
        beta = p.beta || beta;

        const fn = function(t, y) {
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
            let foi = (y[i.A] + y[i.S] + y[i.C] + y[i.E_Pub] + y[i.E_Eng] + y[i.E_Pri]) * beta * adj, infection = 0;

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

        const fn_mea = function(t, y) {
            let dea = (p.R_Die + p.R_Die_Asym) * y[i.A];
            for (let j = i.S; j <= i.E_Pri; j++) {
                dea += (p.R_Die + p.R_Die_Sym) * y[j];
            }

            return {
                'Time': t,
                'IncR': p.R_Act * y[i.Lf] + p.R_React * y[i.Ls] + p.R_Rel_ST * y[i.R_St]  + p.R_Rel_TD * y[i.R_TD] + p.R_Rel_TC * y[i.R_TC],
                'MorR': dea
            };
        }

        const s = new odex.Solver(15);

        const y_start = s.solve(
            fn, 1700,
            [0.99, 0.01, 0, 0, 0,
                0, 0, 0, 0, 0,
                0, 0, 0, 0, 0],
            2020,
        ).y;

        if (!full) {
            return fn_mea(2020, y_start);
        }

        s.denseOutput = true;

        const mea = [];
        s.solve(fn, 2020, y_start, 2030, s.grid(0.5, function(t, y) {
            mea.push(fn_mea(t, y))
        }));
        return mea;
    }

    dist(beta) {
        const ms = this.run(beta);
        return ms.IncR - this.Source.Tar.IncR;
    }

    fit() {
        let beta = 15;
        const dx = 1e-4, eps = 1e-4;

        for (let i = 0; i < 30; i++) {
            let dy = (this.dist(beta + dx / 2) - this.dist(beta - dx / 2)) / dx;
            let y = this.dist(beta);
            beta -= y / dy;

            if (beta < 0) {
                beta = 30;
            }

            if (Math.abs(y) <= eps || beta > 50) {
                break;
            }
        }

        if (Math.abs(this.dist(beta)) <= eps || beta < 50) {
            this.isValid = true;
            this.Source.Pars.beta = beta;
        } else {
            this.Source.Pars.beta = 10;
        }
    }
}


let rawdata = fs.readFileSync("src/ppa/inp_wr.json");
let inps = JSON.parse(rawdata);


let res = Object.values(inps)
    .map(inp => {
        const m = new Simulator(inp);
        m.fit();
        console.log(m.Source.Location, " succ: ", m.isValid, " beta: ", m.Source.Pars.beta);
        // console.log(m.run());
        return m;
    })
    // .filter(m => m.isValid)
    .reduce((collector, m) => {
        collector[m.Source.Location] = m.Source;
        return collector;
    }, {});

fs.writeFile("src/ppa/pars_wr.json", JSON.stringify(res, null, 0), (err) => {
    if (err) {  console.error(err);  return; }
    console.log("File has been created");
});
