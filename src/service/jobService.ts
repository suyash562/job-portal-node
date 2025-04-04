import { Job } from "../entities/job";
import { User } from "../entities/user";
import {
    addJobRepo,
    deleteJobRepo,
    getAllJobsRepo,
    getEmployeerPostedJobsRepo,
    getJobByIdRepo,
    getTotalNumberOfJobsRepo,
    updateJobRepo
} from "../repository/jobRepository";

export const addJobService = async (user: User, job: Job) => {
    return await addJobRepo(user, job);
}

export const updateJobService = async (jobIdToUpdate: number, job: Job) => {
    return await updateJobRepo(jobIdToUpdate, job);
}

export const getEmployeerPostedJobsService = async (user: User) => {
    return await getEmployeerPostedJobsRepo(user);
}

export const deleteJobService = async (jobId: number) => {
    return await deleteJobRepo(jobId);
}

export const getJobByIdService = async (jobId: number) => {
    return await getJobByIdRepo(jobId);
}

export const getAllJobsService = async (page: number, limit: number) => {
    return await getAllJobsRepo(page, limit);
}

export const getTotalNumberOfJobsService = async () => {
    return await getTotalNumberOfJobsRepo();
}
