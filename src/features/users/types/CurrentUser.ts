import type { CondominiumMembership } from "./CondominiumMembership";

export interface CurrentUser {
    fullName: string;
    email: string;
    externalId: string;
    userId: number;
    memberships: CondominiumMembership[]
}