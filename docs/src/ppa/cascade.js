import * as odex from "odex";
import * as math from "mathjs";


export function calc_cascade(p) {
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

    var fn = function(t, y) {
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

    const dur = [0, 0, 0, 0, 0, 0]

    var s = new odex.Solver(20);
    s.denseOutput = true;
    const end = s.solve(fn,
        0,
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        20,
        s.grid(0.01, function(x, y) {
            for (let j = 0; j < i.Tx_Pub; j++) {
                dur[j] += y[j] * 0.01
            }
        })).y;

    const det0 = math.matrix([i.Det0_Pub, i.Det0_Eng, i.Det0_Pri].map(x => end[x])),
        det1 = math.matrix([i.Det1_Pub, i.Det1_Eng, i.Det1_Pri].map(x => end[x]));

    const cdr = (math.sum(det1) + math.sum(det0))

    let res = {
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
    }

    return res;
}


// export function summarise_cascade(pars) {
//     let cas = pars.map(calc_cascade)
//
//     cas = Object.keys(cas[0]).reduce((prev, key) => {
//         prev[key] = math.apply(cas.map(cs => cs[key]), 0, math.mean)
//         return prev
//     }, {})
//
//     return cas;
// }

export function summarise_cascade(pars) {
    pars = Object.keys(pars[0]).reduce((prev, key) => {
        prev[key] = math.apply(pars.map(cs => cs[key]), 0, math.mean)
        return prev
    }, {})

    return calc_cascade(pars)
}

