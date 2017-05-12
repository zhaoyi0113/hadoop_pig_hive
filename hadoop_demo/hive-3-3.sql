
set hive.execution.engine=tez;
analyze table ice_hockey_Teams compute statistics;
analyze table awardscoaches compute statistics;
analyze table master compute statistics;

select a.TeamName as TeamName, a.firstName as FirstName, a.lastname as LastName, a.award as Award, a.won as Won from (
    select t.name as TeamName, m.firstName FirstName, m.lastname LastName, a.award award, a.won won
    from (
    select c.tmid as tmid, c.coachid as coachid, c.award as award, MAX(c.won) as won
        FROM
            (
        select a.tmid as tmid, a.award as award, b.coachid, b.won as won 
        from  (
            select a.tmid, MAX(a.award) as award
                from (
                    select c.tmid as tmid, c.coachid as coachid, a.award as award, c.w as won
                    from coaches c join (
                            select coachid, count(*)    as award
                        from awardscoaches
                        group by    coachid
                            ) a on a.coachid = c.coachid
                ) a  group by a.tmid
        ) a
            JOIN (
                select c.tmid as tmid, c.coachid as coachid, a.award as award, c.w as won
                from coaches c join (
                        select coachid, count(*)    as award
                    from awardscoaches
                    group by    coachid
                        ) a on a.coachid = c.coachid
            )  b 
            ON a.tmid = b.tmid and a.award = b.award
            ) c group by tmid, coachid, award
    ) a
    , ice_hockey_teams t, master m
    where a.tmid = t.tmid and m.coachid = a.coachid
) a group by a.TeamName, a.FirstName, a.LastName, a.Award, a.Won order by TeamName;