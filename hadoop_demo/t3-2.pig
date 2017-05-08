
scoring = load '/usr/input/Scoring.csv' using org.apache.pig.piggybank.storage.CSVExcelStorage(',', 'NO_MULTILINE', 'UNIX', 'SKIP_INPUT_HEADER') as (playerID:chararray, year:int, stint:int, tmid:chararray, lgid:chararray, pos:chararray, gp:int, g:int, a:int, pts:int, pim:int, plusminus:int, ppg:int, ppa:int, shg:int, sha:int, gqg:int, gtg:int, sog:int, postgp:int, postg:int, posta:int, postpts:int, postpim:int, postplusminus:int, postppg:int, postppa:int, postshq:int,postsha:int, postgwg:int, postsog:int);

master = load '/usr/input/Master.csv' using org.apache.pig.piggybank.storage.CSVExcelStorage(',', 'NO_MULTILINE', 'UNIX', 'SKIP_INPUT_HEADER') as (playerID:chararray, coachID:chararray, hofID:chararray, firstName:chararray, lastName:chararray, nameNote:chararray, nameGiven:chararray, nameNick:chararray, height:int, weight:int, shootCatch:chararray, legendsID:chararray, ihdbID:int, hrefID:chararray, firstNHL:int, lastNHL:int, firstWHA:int, lastWHA:int, pos:chararray, birthYear:int, birthMon:int, birthDay:int, birthCountry:chararray, birthState:chararray, birthCity:chararray, deathYear:int, deathMon:int, deathDay:int, deathCountry:chararray, deathState:chararray, deathCity:chararray);

teams = load '/usr/input/Teams.csv' using org.apache.pig.piggybank.storage.CSVExcelStorage(',', 'NO_MULTILINE', 'UNIX', 'SKIP_INPUT_HEADER') as (year:int, lgID:chararray, tmID:chararray, franchID:chararray, confID:chararray, divID:chararray, rank:chararray, playoff:chararray, g:int, w:int, l:int, t:int, otl:chararray, pts:chararray, sow:chararray, sol:chararray, gf:chararray, ga:chararray, name:chararray, pim:chararray, BenchMinor:chararray, PPG:chararray, PPC:chararray, SHA:chararray, PKG:chararray, PKC:chararray, SHF:chararray);

max_scoring = foreach (group scoring by (tmid, playerID)) generate flatten (group) as (tmID, playerID), 
    MAX(scoring.pts) as max_pts;


max_player = foreach (group max_scoring by tmID) generate group as tmID, MAX(max_scoring.max_pts) as max_pts;
-- max_player = join max_scoring by (tmID, max_pts), max_player by (tmID, max_pts) 

max_player_info = foreach (join max_player by (tmID,  max_pts), scoring by (tmid, pts))  generate scoring::playerID as playerID, max_player::tmID as tmID, max_player::max_pts as max_pts ,scoring::year as year, scoring::g as goals, scoring::a as assists;


player_info = foreach(join max_player_info by playerID, master by playerID)
    generate max_player_info::playerID as playerID, max_player_info::tmID as tmID, 
    max_player_info::max_pts as max_pts, max_player_info::year as year, max_player_info::goals as goals, 
    max_player_info::assists as assists, master::firstName as firstName, master::lastName as lastName;

player_team_info =  foreach(join player_info by tmID, teams by tmID) generate teams::name as TeamName, player_info::year, player_info::firstName, player_info::lastName, player_info::max_pts, player_info::goals, player_info::assists;

result = order (distinct player_team_info) by TeamName;
dump result;
