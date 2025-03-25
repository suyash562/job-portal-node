

select * from job_portal_user;

select * from job_portal_user_profile;

truncate table job_portal_user_profile
alter table job_portal_user_profile drop column phoneNumber;
alter table job_portal_user_profile drop UQ_ef5c4f511eebc4b26468ee89ac6