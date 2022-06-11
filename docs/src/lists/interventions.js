export default [
    {
        Name: "PPM",
        Desc: "Private-public mixing",
        Clicked: false,
        Pars: [
            {
                name: "Scale", label: "New engaged private", value:0, min: 0, max: 1
            }
        ]
    },
    {
        Name: "CS",
        Desc: "Facilitate care-seeking",
        Clicked: false,
        Pars: [
            {
                name: "Scale", label: "Care-seeking rate + ", value:0, min: 0, max: 5
            }
        ]
    },
    {
        Name: "ImpDx",
        Desc: "Improved TB diagnosis",
        Clicked: false,
        Pars: [
            {
                name: "Dx", label: "Diagnosis per visit", value:0, min: 0, max: 1
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
    // {
    //     Name: "UACF",
    //     Desc: "Active case-finding, Urban slum",
    //     Clicked: false,
    //     Pars: [
    //         {
    //             name: "Scale", label: "Coverage", value:0, min: 0, max: 1
    //         }
    //     ]
    // },
]
