
select s.name,s.firstName,s.lastName,s.pts, s.year, s.pts, s.g,s.a from (
    select t.name, m.firstName, m.lastName, s.year,s.pts, s.g, s.a from 
    (
    select s.playerId, s.tmId, s.pts, s.g, s.a, s.year FROM
    (select max(s.pts) pts, s.tmid from  scoring s group by s.tmid) t
    join scoring s 
    on s.pts = t.pts and s.tmid = t.tmid
    order by tmid 
    ) s join master m on s.playerId = m.playerId
    join ice_hockey_teams t on t.tmId = s.tmId 
) s group by s.name,s.firstName,s.lastName,s.pts, s.year, s.pts, s.g,s.a