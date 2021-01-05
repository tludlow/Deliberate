create table users
(
	id serial not null
		constraint users_pk
			primary key,
	first_name varchar(50) not null,
	last_name varchar(50) not null,
	email varchar(100) not null,
	password varchar(75) not null,
	created_at timestamp with time zone default now() not null
);

comment on table users is 'users of the application';

alter table users owner to deliberate;

create unique index users_id_uindex
	on users (id);

create unique index users_email_uindex
	on users (email);

create table calendars
(
	id serial not null
		constraint calendars_pk
			primary key,
	owner integer
		constraint calendar_owner
			references users
				on update cascade on delete cascade,
	members jsonb
);

alter table calendars owner to deliberate;

create unique index calendars_id_uindex
	on calendars (id);

create table teams
(
	id serial not null
		constraint teams_pk
			primary key,
	name varchar(50) not null,
	created_at date default now() not null
);

alter table teams owner to deliberate;

create unique index teams_id_uindex
	on teams (id);

create unique index teams_name_uindex
	on teams (name);

create table team_members
(
	team_id integer
		constraint team_members_teams_id_fk
			references teams
				on update cascade on delete cascade,
	user_id integer
		constraint team_members_users_id_fk
			references users
				on update cascade on delete cascade,
	joined_at timestamp default now() not null,
	constraint team_members_pk
		unique (team_id, user_id)
);

alter table team_members owner to deliberate;

