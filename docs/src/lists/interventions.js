export default [
    {
        Name: "PPM",
        Desc: "Private-public mixing",
        Clicked: false,
        Pars: [
            {
                name: "Scale", label: "Prop. remaining private providers to be engaged", value:0, min: 0, max: 1
            }
        ]
    },
    {
        Name: "CS",
        Desc: "Reducing symptomatic period",
        Clicked: false,
        Pars: [
            {
                name: "Scale", label: "Reduction in time to next care-seeking, %", value:0, min: 0, max: 0.99
            }
        ]
    },
    {
        Name: "ImpDx",
        Desc: "Improved TB diagnostics",
        Clicked: false,
        Pars: [
            {
                name: "Dx", label: "Prop. of smear facilities replaced by modern dx", value:0, min: 0, max: 1
            },
            // {
            //     name: "TxI", label: "Amongst patients with TB presenting for care, prop. successfully linked to treatment with new dx", value:0, min: 0, max: 1
            // }
        ]
    },
    {
        Name: "TPT",
        Desc: "TB preventive therapy",
        Clicked: false,
        Pars: [
            {
                name: "Scale", label: "Prop. household contacts completing TPT", value:0, min: 0, max: 1
            }
        ]
    },
    {
        Name: "UACF",
        Desc: "*Urban Active Case-Finding",
        Clicked: false,
        Pars: [
            {
                name: "Scale", label: "Prop. prevalent urban TB dx per year", value:0, min: 0, max: 1
            }
        ]
    },
    {
        Name: "Vaccine",
        Desc: "*Vaccine",
        Clicked: false,
        Pars: [
            {
                name: "Scale", label: "Prop. LTBIs having vaccine-induced immunity", value:0, min: 0, max: 1
            },
            {
                name: "Year0", label: "Start of vaccine rollout", value:2023, min: 2023, max: 2025
            },
            {
                name: "Eff", label: "Vaccine eff. in reducing TB incidence", value:0, min: 0, max: 1
            },

        ]
    },
]



