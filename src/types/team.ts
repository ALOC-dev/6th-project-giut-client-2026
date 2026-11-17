import type { role } from '@/theme';

export type RoleKey = keyof typeof role;

export type Member = {
    id: string;
    name: string;
    role: RoleKey;
    isLeader: boolean;
};

export type OperationMethod = 'offline' | 'online' | 'both';

export type ActivityFrequency = '주 1회' | '주 2회' | '주 3회' | '주 4회+';

export type ActivityPlace = '교내' | '서울 전체' | '수도권' | '상관 없음';

export type CooperationTool = '디스코드' | '줌' | '구글 밋' | '노션' | '슬랙';

export type Team = {
    id: string;
    contestId: string;
    name: string;
    capacity: number;
    recruitEndDate: string;
    members: Member[];
    recruitingRoles: RoleKey[];
    description: string;
    operationMethod: OperationMethod;
    activityFrequency: ActivityFrequency;
    activityPlace: ActivityPlace;
    cooperationTools: CooperationTool[];
};
