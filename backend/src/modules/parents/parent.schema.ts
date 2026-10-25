import {z} from 'zod';
export const parentDashboardSchema=z.object({
query: z.object({
    studentId:z.string().uuid('A valid student ID is required'),
}),
});
export const parentStudentParamsSchema = z.object({
  params: z.object({
    studentId: z.string().uuid('A valid student ID is required'),
  }),
});

export type ParentDashboardQuery = z.infer<
  typeof parentDashboardSchema
>['query'];

export type ParentStudentParams = z.infer<
  typeof parentStudentParamsSchema
>['params'];