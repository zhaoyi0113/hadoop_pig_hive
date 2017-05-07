select distinct(t.name) TeamName, m.firstName, m.lastname,a.award,a.won  from
(
select      c.tmid                              as tmid
           ,max(struct(a.cnt,a.coachid,c.w)).col2   as coachid
           ,max(struct(a.cnt,a.coachid,c.w)).col1   as award
           ,max(struct(a.cnt,a.coachid,c.w)).col3   as won
from                    coaches c

            join       (select      coachid
                                   ,count(*)    as cnt

                        from        awardscoaches

                        group by    coachid
                        ) a

            on          a.coachid =
                        c.coachid

group by    c.tmid
) a
, ice_hockey_teams t, master m
where a.tmid = t.tmid and m.coachid = a.coachid
order by TeamName;
