export default [
    {
        Name: "CS",
        Desc: "Demand generation",
        Clicked: false,
        Pars: [
            {
                name: "Scale", label: "Coverage", value:0, min: 0, max: 1
            }
        ]
    },
    {
        Name: "TPT",
        Desc: "TB preventive therapy",
        Clicked: false,
        Pars: [
            {
                name: "Scale", label: "Coverage", value:0, min: 0, max: 1
            }
        ]
    },
    {
        Name: "PPM",
        Desc: "Private-public mixing",
        Clicked: false,
        Pars: [
            {
                name: "Scale", label: "Coverage", value:0.35, min: 0, max: 1
            }
        ]
    },
    {
        Name: "UACF",
        Desc: "Active case-finding, Urban slum",
        Clicked: false,
        Pars: [
            {
                name: "Scale", label: "Coverage", value:0, min: 0, max: 1
            }
        ]
    },
    {
        Name: "ImpDx",
        Desc: "Improved TB diagnosis",
        Clicked: false,
        Pars: [
            {
                name: "Dx", label: "Diagnosis", value:0.95, min: 0, max: 1
            },
            {
                name: "TxI", label: "Tx initialisation", value:0.8, min: 0, max: 1
            },
            {
                name: "Def", label: "Tx compliance", value:1, min: 0, max: 1
            }
        ]
    },
]
