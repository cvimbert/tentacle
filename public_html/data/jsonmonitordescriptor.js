var monitorDesc = {
    sets: {
        panelsset1: {
            template: "includes/layout.html",
            title: "Set de panneaux 1",
            css: "test-set1",
            panels: {
                panel1: {
                    name: "Panneau des sprites",
                    type: "Sprite",
                    containerid: "centera1",
                    css: "test-panel1"
                },
                panel2: {
                    name: "Panneau des variables",
                    type: "Variable",
                    containerid: "centera2"
                }
            },
            buttons: {
                bouton1a: {
                    label: "Aller au panneau 2",
                    containerid: "top-right",
                    action: {
                        type: "navigatetopanel",
                        panelid: "panelsset2"
                    }
                }
            }
        },
        panelsset2: {
            template: "includes/layout.html",
            title: "Set de panneaux 2",
            css: "",
            panels: {
                panel1b: {
                    name: "Panneau des variables bbbb",
                    type: "Variable",
                    containerid: "centera1"
                }
            },
            buttons: {
                bouton1b: {
                    label: "Aller au panneau 1",
                    containerid: "top-right",
                    action: {
                        type: "navigatetopanel",
                        panelid: "panelsset1"
                    }
                }
            }
        },
        common: {
            
        }
    },
    defaultset: "panelsset1"
};