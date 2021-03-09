create table users
(
    id           serial                                 not null
        constraint users_pk
            primary key,
    first_name   varchar(50)                            not null,
    last_name    varchar(50)                            not null,
    email        varchar(100)                           not null,
    password     varchar(75)                            not null,
    created_at   timestamp with time zone default now() not null,
    github_token varchar(100),
    github_id    integer
);

comment on table users is 'users of the application';

alter table users
    owner to deliberate;

create unique index users_id_uindex
    on users (id);

create unique index users_email_uindex
    on users (email);

create table teams
(
    id         serial             not null
        constraint teams_pk
            primary key,
    name       varchar(50)        not null,
    created_at date default now() not null
);

alter table teams
    owner to deliberate;

create unique index teams_id_uindex
    on teams (id);

create unique index teams_name_uindex
    on teams (name);

create table team_members
(
    team_id    integer
        constraint team_members_teams_id_fk
            references teams
            on update cascade on delete cascade,
    user_id    integer
        constraint team_members_users_id_fk
            references users
            on update cascade on delete cascade,
    joined_at  timestamp        default now()                       not null,
    permission permission_level default 'regular'::permission_level not null,
    constraint team_members_pk
        unique (team_id, user_id)
);

alter table team_members
    owner to deliberate;

create table user_calendars
(
    id      serial not null
        constraint user_calendars_pk
            primary key,
    user_id integer
        constraint user_calendars_users_id_fk
            references users
            on update cascade on delete cascade
);

alter table user_calendars
    owner to deliberate;

create table tasks
(
    id          serial                                            not null
        constraint tasks_pk
            primary key,
    title       varchar(50)                                       not null,
    description varchar(200)                                      not null,
    day         date                                              not null,
    start_time  time                                              not null,
    end_time    time,
    calendar_id integer
        constraint tasks_user_calendars_id_fk
            references user_calendars
            on update cascade on delete cascade,
    type        varchar(15) default 'personal'::character varying not null
);

alter table tasks
    owner to deliberate;

create unique index tasks_id_uindex
    on tasks (id);

create unique index user_calendars_id_uindex
    on user_calendars (id);

create table user_repos
(
    user_id integer not null,
    repo_id integer not null,
    constraint user_repos_pk
        primary key (user_id, repo_id)
);

alter table user_repos
    owner to deliberate;

create table tracked_repos
(
    repo_id  serial not null,
    name     varchar(50),
    owner    varchar(50),
    owner_id integer
);

alter table tracked_repos
    owner to deliberate;

create table milestones
(
    id          serial       not null
        constraint milestones_pk
            primary key,
    title       varchar(100) not null,
    description varchar(300),
    due_date    date,
    state       varchar(20)  not null,
    repo_id     integer      not null
        constraint milestones_tracked_repos_repo_id_fk
            references tracked_repos (repo_id)
            on update cascade on delete cascade
);

alter table milestones
    owner to deliberate;

create unique index milestones_id_uindex
    on milestones (id);

create unique index tracked_repos_repo_id_uindex
    on tracked_repos (repo_id);

create table connected_sso
(
    id        serial  not null
        constraint connected_sso_pk
            primary key,
    user_id   integer not null
        constraint connected_sso_users_id_fk
            references users
            on update cascade on delete cascade,
    github_id integer
);

alter table connected_sso
    owner to deliberate;

create unique index connected_sso_id_uindex
    on connected_sso (id);

create unique index connected_sso_user_id_uindex
    on connected_sso (user_id);

create table issues
(
    id             integer                                not null
        constraint issues_pk
            primary key,
    repo_id        integer                                not null
        constraint issues_tracked_repos_repo_id_fk
            references tracked_repos (repo_id)
            on update cascade on delete cascade,
    title          varchar(100)                           not null,
    description    varchar(500),
    assigned_users integer[],
    milestone_id   integer
        constraint issues_milestones_id_fk
            references milestones,
    labels         text[],
    created_at     date                     default now() not null,
    updated_at     timestamp with time zone default now() not null
);

alter table issues
    owner to deliberate;

create unique index issues_id_uindex
    on issues (id);

create trigger set_timestamp
    before update
    on issues
    for each row
execute procedure trigger_set_timestamp();

