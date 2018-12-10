export declare const demoinput: {
    operationalSince: number;
    capacityWh: number;
    country: string;
    region: string;
    active: boolean;
    nestedObject: {
        id: number;
        somedata: string;
        ObjectInObjectInObject: {
            id: number;
            somedata: string;
        };
    };
    zip: string;
    city: string;
    street: string;
    houseNumber: string;
    gpsLatitude: string;
    gpsLongitude: string;
    listElement: number[];
};
export declare const malignDemoinput: {
    here: number;
    is: number;
    a: string;
    little: string;
    lesson: boolean;
    in: {
        fact: string;
    };
    trickery: string;
    street: string;
    whatever: string;
    you: number;
    can: string[];
    write: string;
    important: string;
};
export declare function grabRegistry(address?: string): any;
export declare function newCommitment(name: string, treeHash: string, schema: any[], transaction?: {}): any;
export declare function localAccounts(): Promise<any>;
export declare function getCommitment(address: string, name: string): Promise<any>;
