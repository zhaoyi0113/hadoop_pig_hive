
select  distinct( h.name )TeamName, 
    m.firstname FirstName, m.lastname LastName, t.year Year, 
	t.pts Point, t.goals Goals, t.assists Assists
from 

(select t.pts pts, t.year year, t.goals goals, t.assists assists, s.playerId, t.tmid from 
    (select max(struct(s.pts, s.year,s.g, s.a)).col1 pts
	,max(struct(s.pts, s.year,s.g, s.a)).col2 year
	,max(struct(s.pts, s.year,s.g, s.a)).col3 goals
	,max(struct(s.pts, s.year,s.g, s.a)).col4 assists
	,s.tmid from  scoring s group by s.tmid) t
    join scoring s on s.pts = t.pts and s.year = t.year and s.g = t.goals and s.a = t.assists
) t
join master m on (m.playerId = t.playerId)
join ice_hockey_teams h on h.tmid = t.tmid
order by TeamName;
