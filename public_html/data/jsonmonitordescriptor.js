var monitorDesc = {
    sets: {
        panelsset1: {
            template: "includes/layout1.html",
            title: "Set de panneaux 1",
            css: "test-set1",
            panels: {
                panel1: {
                    name: "Panneau d'édition",
                    type: "Sprite",
                    containerid: "main",
                    css: "test-panel1",
                    template: "includes/spritespanel.html",
                    controller: "spritespanelcontroller"
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
                },
                bouton1b: {
                    label: "Enregistrer",
                    containerid: "top-right",
                    action: {
                        type: "save"
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
                    name: "Panneau des contrôles",
                    type: "ControlSprite",
                    containerid: "centera1"
                },
                panel2b: {
                    name: "Panneau des sprites",
                    type: "Sprite",
                    containerid: "centera2",
                    css: "test-panel1"
                },
                panel3b: {
                    name: "Panneau de premier plan",
                    type: "ForegroundSprite",
                    containerid: "centerb1",
                    css: "test-panel1"
                },
                panel4b: {
                    name: "Panneau d'arrière plan",
                    type: "BackgroundSprite",
                    containerid: "centerb2",
                    css: "test-panel1"
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