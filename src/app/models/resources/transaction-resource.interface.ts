import { MoneyObject } from "../money-object.interface";
import { Identifier } from "../identifier.interface";

enum TransactionStatus {
    HELD = 'held',
    SETTLED = 'settled'
}

enum CardPurchaseMethod {
    BAR_CODE = 'bar code',
    OCR = 'ocr',
    CARD_PIN = 'card pin',
    CARD_DETAILS = 'card details',
    CARD_ON_FILE = 'card on file',
    ECOMMERCE = 'ecommerce',
    MAGNETIC_STRIPE = 'magnetic stripe',
    CONTACTLESS = 'contactless'
}

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

        settledAt?: string,
        createdAt: string,
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