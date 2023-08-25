export class Transaction {
    public id!: string;
    public status!: string;
    public description!: string;
    public message!: string;
    public currency!: string;
    public value!: number;
    public settledDate!: string;
    public createdDate!: string;
    public remainingBalance!: number;
}