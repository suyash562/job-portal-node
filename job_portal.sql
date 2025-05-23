-- Update notifications trigger
create trigger update_notifications_count
on job_portal_notification
after insert
as
declare @userEmail varchar(40)
set @userEmail= (select userEmail from inserted)
begin
	update job_portal_user set newNotifications = newNotifications + 1 where email = @userEmail;
end

insert into job_portal_user values('admin@gmail.com', '$2b$10$YBgrYRyRNw3skw19HvyOluCiRW0vN0NWczkjG47yC4FICttqDqeH6', 'admin', 1, 0, 1)
insert into job_portal_user_profile values('snap', 'hire', 'address', 'admin@gmail.com', 0, 0);


select role, count(role) from job_portal_user where isVerifiedByAdmin = 1 group by role ;



select * from job_portal_user;
select * from job_portal_user_profile;
select * from job_portal_contact_number;
select * from job_portal_employee_company;
select * from job_portal_job;
select * from job_portal_application;
select * from job_portal_notification;
select * from interview_schedule_application;

 update job_portal_user set isVerifiedByAdmin = 1 where email = 'emp1@gmail.com';
-- update job_portal_user_profile set primaryResume = 0, resumeCount = 0 where id = 35;

delete from job_portal_user where email = 's9579100@gmail.com';
delete from job_portal_job 
delete from job_portal_application;
delete from interview_schedule_application;
delete from job_portal_notification;
delete from job_portal_user where role = 'employeer';


exec sp_help job_portal_notification;



update job_portal_user set newNotifications = 0 where newNotifications = 1;
update job_portal_application set isActive = 1;
update job_portal_job set isActive = 1;
update job_portal_notification set isRead = 0 where id = 4


delete from job_portal_application where status = 'resume'