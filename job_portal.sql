

select * from job_portal_user;
select * from job_portal_user_profile;

select * from job_portal_employee_company;
select * from job_portal_job;
select * from job_portal_application;
select * from interview_schedule_application;

update job_portal_user_profile set primaryResume = 0 where id = 39;

-- delete from job_portal_user 
 delete from job_portal_job 
 delete from job_portal_application;
-- delete from interview_schedule_application;
delete from job_portal_user where role = 'user';

select * from job_portal_job where deadlineForApplying > '2025-04-05';

exec sp_help job_portal_job

update job_portal_application set status = 'Interview' where id = 11;

update job_portal_job set deadlineForApplying = '2025-04-01' where id = 16;
update job_portal_job set isActive = 0 where id = 16;

--update job_portal_job set isActive = 1 where vacancies > 5;
--truncate table job_portal_user_profile
-- alter table job_portal_user_profile drop column phoneNumber;
-- alter table job_portal_user_profile drop UQ_ef5c4f511eebc4b26468ee89ac6

--insert into job_portal_user values('admin@gmail.com', 'Admin@123', 'admin');
insert into job_portal_user_profile values('first', 'last', 'Admin Address', '', 'admin@gmail.com', '9999999999');



update job_portal_application 
set isActive = 1
where id = 19;