
select  distinct( h.name )TeamName, 
    m.firstname FirstName, m.lastname LastName, t.year Year, 
	t.pts Point, t.goals Goals, t.assists Assists, m.playerId
from 
(select t.pts pts, t.year year, t.goals goals, t.assists assists, s.playerId, t.tmid from 
    (select max(s.pts) pts, s.tmid from  scoring s group by s.tmid) t
    join scoring s on s.pts = t.pts and s.year = t.year and s.g = t.goals and s.a = t.assists
) t
join master m on (m.playerId = t.playerId)
join ice_hockey_teams h on h.tmid = t.tmid
where h.name = 'Czechoslovakia'
order by TeamName;
