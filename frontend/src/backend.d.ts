import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Essay {
    id: bigint;
    title: string;
    tags: Array<string>;
    isFeatured: boolean;
    publicationDate: bigint;
    excerpt: string;
}
export interface ContactInfo {
    linkedIn: string;
    email: string;
    bluesky: string;
}
export interface UserProfile {
    name: string;
}
export interface PageContent {
    title: string;
    content: string;
    subtitle: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addEssay(title: string, excerpt: string, tags: Array<string>, publicationDate: bigint): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteEssay(id: bigint): Promise<void>;
    getAllEssays(): Promise<Array<Essay>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContactInfo(): Promise<ContactInfo>;
    getFeaturedEssay(): Promise<Essay | null>;
    getPageContent(page: string): Promise<PageContent>;
    getSiteBranding(): Promise<string>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initializeAccessControl(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setFeaturedEssay(id: bigint): Promise<void>;
    updateContactInfo(email: string, linkedIn: string, bluesky: string): Promise<void>;
    updateEssay(id: bigint, title: string, excerpt: string, tags: Array<string>, publicationDate: bigint): Promise<void>;
    updatePageContent(page: string, content: PageContent): Promise<void>;
}
