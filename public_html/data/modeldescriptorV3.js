
var modelDescriptorV3 = {
    //Objects

    Sequence: {
        referenceable: true,
        attributes: {
            name: {
                type: "string",
                defaultvalue: "sequencename",
                required: true
            },
            spritesgroup: {
                type: "reference",
                referencetype: "SpritesGroup",
                required: true
            },
            looptype: {
                type: "include",
                includetype: "LoopType",
                required: false
            },
            states: {
                type: "collection",
                collectiontype: "reference",
                referencetype: "GroupState",
                required: true
            }
        }
    },
    GroupState: {
        referenceable: true,
        attributes: {
            name: {
                type: "string",
                defaultvalue: "groupstatename",
                required: true
            },
            group: {
                type: "reference",
                referencetype: "SpritesGroup",
                required: true
            },
            sprites: {
                type: "collection",
                collectiontype: "reference",
                referencetype: "linkedcollection",
                linkedcollectionattribute: "group",
                linkedcollectionattributevalue: "sprites",
                //referencetype: "Sprite",
                required: true
            }
        }
    },
    Action: {
        referenceable: true,
        attributes: {
            name: {
                type: "string",
                defaultvalue: "actionname",
                required: true
            },
            condition: {
                type: "reference",
                referencetype: "Condition",
                required: false
            },
            actiontype: {
                type: "ConditionalAttributesSet",
                required: true,
                attributesSets: {
                    displaysprite: {
                        sprite: {
                            type: "reference",
                            referencetype: "Sprite",
                            required: true
                        }
                    },
                    showgroup: {
                        group: {
                            type: "reference",
                            referencetype: "SpritesGroup",
                            required: true
                        }
                    },
                    stopclock: {
                    },
                    startclock: {
                    },
                    hidegroup: {
                        group: {
                            type: "reference",
                            referencetype: "SpritesGroup",
                            required: true
                        }
                    },
                    stopsequence: {
                        sequence: {
                            type: "reference",
                            referencetype: "Sequence",
                            required: true
                        }
                    },
                    nextinsequence: {
                        sequence: {
                            type: "reference",
                            referencetype: "Sequence",
                            required: true
                        }
                    },
                    previousinsequence: {
                        sequence: {
                            type: "reference",
                            referencetype: "Sequence",
                            required: true
                        }
                    },
                    nextloop: {
                        sequence: {
                            type: "reference",
                            referencetype: "Sequence",
                            required: true
                        }
                    },
                    randomaction: {
                        actions: {
                            type: "collection",
                            collectiontype: "reference",
                            referencetype: "Action",
                            required: true
                        },
                        randmode: {
                            type: "include",
                            includetype: "RandMode"
                        }
                    },
                    incvariable: {
                        variable: {
                            type: "reference",
                            referencetype: "Variable",
                            required: true
                        }
                    },
                    decvariable: {
                        variable: {
                            type: "reference",
                            referencetype: "Variable",
                            required: true
                        }
                    },
                    setvariable: {
                        variable: {
                            type: "reference",
                            referencetype: "Variable",
                            required: true
                        },
                        value: {
                            type: "include",
                            includetype: "VariableValueByType"
                        }
                    },
                    actions: {
                        actions: {
                            type: "collection",
                            collectiontype: "reference",
                            referencetype: "Action"
                        }
                    },
                    resetsequence: {
                        sequence: {
                            type: "reference",
                            referencetype: "Sequence",
                            required: true
                        }
                    },
                    animiteration: {
                        sequence: {
                            type: "reference",
                            referencetype: "Sequence",
                            required: true
                        },
                        period: {
                            type: "number",
                            required: true
                        },
                        iterations: {
                            type: "number",
                            required: true,
                            defaultvalue: 1
                        },
                        oncomplete: {
                            type: "reference",
                            referencetype: "Action",
                            required: false
                        },
                        oniteration: {
                            type: "reference",
                            referencetype: "Action",
                            required: false
                        },
                        onstep: {
                            type: "reference",
                            referencetype: "Action",
                            required: false
                        },
                        stepnumber: {
                            type: "number",
                            required: true
                        }
                    },
                    togglestart: {
                    },
                    wait: {
                        action: {
                            type: "reference",
                            referencetype: "Action",
                            required: true
                        },
                        time: {
                            type: "number",
                            required: true,
                            defaultvalue: 500
                        }
                    },
                    setsequencestep: {
                        sequence: {
                            type: "reference",
                            referencetype: "Sequence",
                            required: true
                        },
                        step: {
                            type: "reference",
                            referencetype: "linkedcollection",
                            linkedcollectionattribute: "sequence",
                            linkedcollectionattributevalue: "states",
                            required: true
                        }
                    },
                    setgroupstate: {
                        state: {
                            type: "reference",
                            referencetype: "GroupState",
                            required: true
                        },
                        grouprefresh: {
                            type: "boolean",
                            required: true
                        }
                    },
                    disabletrigger: {
                        trigger: {
                            type: "reference",
                            referencetype: "Trigger",
                            required: true
                        }
                    },
                    enabletrigger: {
                        trigger: {
                            type: "reference",
                            referencetype: "Trigger",
                            required: true
                        }
                    },
                    disablecontrol: {
                        control: {
                            type: "reference",
                            referencetype: "Control",
                            required: true
                        }
                    },
                    enablecontrol: {
                        control: {
                            type: "reference",
                            referencetype: "Control",
                            required: true
                        }
                    },
                    enablecontrols: {
                    },
                    disablecontrols: {
                    },
                    playsound: {
                        sound: {
                            type: "reference",
                            referencetype: "Sound",
                            required: true
                        }
                    },
                    cadencyup: {
                        factor: {
                            type: "number",
                            required: true,
                            defaultvalue: 0.05
                        }
                    }
                }
            }
        }
    },
    Trigger: {
        referenceable: true,
        attributes: {
            name: {
                type: "string",
                defaultvalue: "groupstatename",
                required: true
            },
            action: {
                type: "reference",
                referencetype: "Action",
                required: true
            },
            condition: {
                type: "reference",
                referencetype: "Condition",
                required: false
            },
            triggertype: {
                type: "ConditionalAttributesSet",
                required: true,
                attributesSets: {
                    controlclick: {
                        control: {
                            type: "reference",
                            referencetype: "Control",
                            required: true
                        }
                    },
                    clockperiod: {
                    },
                    sequencestepleave: {
                        sequence: {
                            type: "reference",
                            referencetype: "Sequence",
                            required: true
                        },
                        step: {
                            type: "reference",
                            referencetype: "linkedcollection",
                            linkedcollectionattribute: "sequence",
                            linkedcollectionattributevalue: "states",
                            required: true
                        }
                    },
                    sequencestepenter: {
                        sequence: {
                            type: "reference",
                            referencetype: "Sequence",
                            required: true
                        },
                        step: {
                            type: "reference",
                            referencetype: "linkedcollection",
                            linkedcollectionattribute: "sequence",
                            linkedcollectionattributevalue: "states",
                            required: true
                        }
                    },
                    endloop: {
                    },
                    spritescollision: {
                        sprite1: {
                            type: "reference",
                            referencetype: "Sprite",
                            required: true
                        },
                        sprite2: {
                            type: "reference",
                            referencetype: "Sprite",
                            required: true
                        }
                    },
                    timeinterval: {
                        time: {
                            type: "number",
                            required: true,
                            defaultvalue: 500
                        }
                    }
                }
            }
        }
    },
    Package: {
        referenceable: true,
        attributes: {
            name: {
                type: "string",
                defaultvalue: "packagename",
                required: true
            },
            identifier: {
                type: "string",
                defaultvalue: "identifier",
                required: true
            }
        }
    },
    SoundFileReference: {
        referenceable: true,
        attributes: {
            name: {
                type: "string",
                defaultvalue: "soundfilename",
                required: true
            },
            file: {
                type: "string",
                required: true
            },
            package: {
                type: "reference",
                referencetype: "Package",
                required: true
            }
        }
    },
    SpriteFileReference: {
        referenceable: true,
        attributes: {
            name: {
                type: "string",
                defaultvalue: "spritefilename",
                required: true
            },
            file: {
                type: "string",
                required: true
            },
            package: {
                type: "reference",
                referencetype: "Package",
                required: true
            }
        }
    },
    DecorationFileReference: {
        referenceable: true,
        attributes: {
            name: {
                type: "string",
                defaultvalue: "decorationfilename",
                required: true
            },
            file: {
                type: "string",
                required: true
            },
            package: {
                type: "reference",
                referencetype: "Package",
                required: true
            }
        }
    },
    ControlFileReference: {
        referenceable: true,
        attributes: {
            name: {
                type: "string",
                defaultvalue: "controlfilename",
                required: true
            },
            file: {
                type: "string",
                required: true
            },
            package: {
                type: "reference",
                referencetype: "Package",
                required: true
            }
        }
    },
    Sprite: {
        referenceable: true,
        attributes: {
            name: {
                type: "string",
                defaultvalue: "spritename",
                required: true
            },
            reference: {
                type: "reference",
                referencetype: "SpriteFileReference",
                required: true
            },
            x: {
                type: "number",
                defaultvalue: 0,
                required: true
            },
            y: {
                type: "number",
                defaultvalue: 0,
                required: true
            }
        }
    },
    ControlSprite: {
        referenceable: true,
        attributes: {
            name: {
                type: "string",
                defaultvalue: "controlspritename",
                required: true
            },
            reference: {
                type: "reference",
                referencetype: "ControlFileReference",
                required: true
            },
            x: {
                type: "number",
                required: true
            },
            y: {
                type: "number",
                required: true
            }
        }
    },
    SpritesGroup: {
        referenceable: true,
        attributes: {
            name: {
                type: "string",
                defaultvalue: "spritesgroupname",
                required: true
            },
            sprites: {
                type: "collection",
                collectiontype: "reference",
                referencetype: "Sprite",
                required: true
            }
        }
    },
    Variable: {
        referenceable: true,
        attributes: {
            name: {
                type: "string",
                defaultvalue: "variablename",
                required: true
            },
            variabletype: {
                type: "ConditionalAttributesSet",
                required: true,
                attributesSets: {
                    string: {
                        stringvalue: {
                            type: "string",
                            defaultvalue: "value",
                            required: true
                        }
                    },
                    number: {
                        numbervalue: {
                            type: "number",
                            defaultvalue: 0,
                            required: true
                        }
                    },
                    boolean: {
                        stringvalue: {
                            type: "boolean",
                            defaultvalue: "false",
                            required: true
                        }
                    }
                }
            }
        }
    },
    Condition: {
        referenceable: true,
        attributes: {
            name: {
                type: "string",
                defaultvalue: "conditionname",
                required: true
            },
            conditiontype: {
                type: "ConditionalAttributesSet",
                required: true,
                attributesSets: {
                    checkvariable: {
                        variable: {
                            type: "reference",
                            referencetype: "Variable",
                            required: true
                        },
                        operator: {
                            type: "include",
                            includetype: "ArithmeticOperator",
                            required: true
                        },
                        variabletype: {
                            type: "LinkedConditionalAttributesSet",
                            linktype: "referenceattributevalue",
                            linkedreference: "variable",
                            linkedattribute: "variabletype",
                            required: true,
                            attributesSets: {
                                string: {
                                    stringvalue: {
                                        type: "string",
                                        defaultvalue: "value",
                                        required: true
                                    }
                                },
                                number: {
                                    numbervalue: {
                                        type: "number",
                                        defaultvalue: 0,
                                        required: true
                                    }
                                },
                                boolean: {
                                    booleanvalue: {
                                        type: "boolean",
                                        defaultvalue: "false",
                                        required: true
                                    }
                                }
                            }
                        }
                    },
                    othertemp: {
                    }
                }
            }
        }
    },
    Control: {
        referenceable: true,
        attributes: {
            name: {
                type: "string",
                defaultvalue: "controlname",
                required: true
            },
            sprite: {
                type: "reference",
                referencetype: "ControlSprite",
                required: true
            }
        }
    },
    Sound: {
        referenceable: true,
        attributes: {
            name: {
                type: "string",
                defaultvalue: "controlname",
                required: true
            },
            file: {
                type: "reference",
                referencetype: "SoundFileReference",
                required: true
            }
        }
    },
    ConditionalGroupStateSet: {
        referenceable: true,
        attributes: {
            name: {
                type: "string",
                defaultvalue: "conditionalgroupstatename",
                required: true
            },
            group: {
                type: "reference",
                referencetype: "SpritesGroup",
                required: true
            },
            conditionalstates: {
                type: "collection",
                collectiontype: "ConditionalGroupState",
                required: true
            },
            defaultstate: {
                type: "reference",
                referencetype: "GroupState",
                required: true
            }
        }
    },
    // à partir d'ici, ce ne sont plus des objets complets
    ConditionalGroupState: {
        attributes: {
            state: {
                type: "reference",
                referencetype: "GroupState",
                required: true
            },
            condition: {
                type: "reference",
                referencetype: "Condition",
                required: true
            }
        }
    },
    ArithmeticOperator: {
        type: "Enumeration",
        required: true,
        enumerationvalues: ["===", "!==", "<", ">", "<=", ">="]
    },
    LoopType: {
        type: "Enumeration",
        enumerationvalues: ["circle", "reset"]
    },
    RandMode: {
        type: "Enumeration",
        enumerationvalues: ["sequence", "sequencen"]
    },
    VariableValue: {
        type: "ConditionalAttributesSet",
        required: true,
        attributesSets: {
            string: {
                stringvalue: {
                    type: "string",
                    defaultvalue: "value",
                    required: true
                }
            },
            number: {
                numbervalue: {
                    type: "number",
                    defaultvalue: 0,
                    required: true
                }
            },
            boolean: {
                booleanvalue: {
                    type: "boolean",
                    defaultvalue: "false",
                    required: true
                }
            }
        }
    },
    VariableValueByType: {
        type: "LinkedConditionalAttributesSet",
        linktype: "referenceattributevalue",
        linkedreference: "variable",
        linkedattribute: "variabletype",
        required: true,
        attributesSets: {
            string: {
                stringvalue: {
                    type: "string",
                    defaultvalue: "value",
                    required: true
                }
            },
            number: {
                numbervalue: {
                    type: "number",
                    defaultvalue: 0,
                    required: true
                }
            },
            boolean: {
                booleanvalue: {
                    type: "boolean",
                    defaultvalue: "false",
                    required: true
                }
            }
        }
    }

};