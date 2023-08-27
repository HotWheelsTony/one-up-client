import { MoneyObject } from "./money-object.interface";

enum OwnershipType {
    INDIVIDUAL = 'individual',
    JOINT = 'joint',
}

enum AccountType {
    SAVER = 'saver',
    TRANSACTIONAL = 'transactional',
    HOME_LOAN = 'home loan',
}

export interface AccountResource {

    type: string;
    id: string;

    attributes: {
        displayName: string;
        accountType: AccountType;
        ownershipType: OwnershipType;
        balance: MoneyObject;
        createdAt: string;
    }

    relationships: {
        transactions: {
            links?: {
                related: string;
            }
        }
    }

    links?: {
        self: string;
    }

}