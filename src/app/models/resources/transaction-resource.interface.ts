import { MoneyObject } from "../money-object.interface";
import { Identifier } from "../identifier.interface";
import { TransactionStatus } from "../transaction-status.enum";
import { CardPurchaseMethod } from "../card-purchase-method.enum";

export interface TransactionResource {
    type: string;
    id: string;

    //custom property
    remainingBalance: number;

    attributes: {
        status: TransactionStatus,
        rawText?: string,
        description: string,
        message?: string,
        isCategorizable: boolean,
        holdInfo: {
            amount: MoneyObject,
            foreignAmount?: MoneyObject
        }
        roundUp?: {
            amount: MoneyObject,
            boostPortion?: MoneyObject
        }
        cashback?: {
            description: string,
            amount: MoneyObject
        }
        amount: MoneyObject,
        foreignAmount?: MoneyObject,
        cardPurchaseMethod?: CardPurchaseMethod,

        settledAt: string,
        createdAt: string,
        transactionType: string;
    };

    relationships: {
        account: {
            data: Identifier
        },
        transferAccount: {
            data?: Identifier
        },
        category: {
            data?: Identifier
        },
        parentCategory: {
            data?: Identifier
        },
        tags: {
            data: Identifier[]
        }
    };

    links: {
        self: string
    }
}