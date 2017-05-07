
scoring = load '/usr/input/Scoring.csv' using org.apache.pig.piggybank.storage.CSVExcelStorage(',', 'NO_MULTILINE', 'UNIX', 'SKIP_INPUT_HEADER') as (playerID:chararray, year:int, stint:int, tmid:chararray, lgid:chararray, pos:chararray, gp:int, g:int, a:int, pts:int, pim:int, plusminus:int, ppg:int, ppa:int, shg:int, sha:int, gqg:int, gtg:int, sog:int, postgp:int, postg:int, posta:int, postpts:int, postpim:int, postplusminus:int, postppg:int, postppa:int, postshq:int,postsha:int, postgwg:int, postsog:int);

master = load '/usr/input/Master.csv' using org.apache.pig.piggybank.storage.CSVExcelStorage(',', 'NO_MULTILINE', 'UNIX', 'SKIP_INPUT_HEADER') as (playerID:chararray, coachID:chararray, hofID:chararray, firstName:chararray, lastName:chararray, nameNote:chararray, nameGiven:chararray, nameNick:chararray, height:int, weight:int, shootCatch:chararray, legendsID:chararray, ihdbID:int, hrefID:chararray, firstNHL:int, lastNHL:int, firstWHA:int, lastWHA:int, pos:chararray, birthYear:int, birthMon:int, birthDay:int, birthCountry:chararray, birthState:chararray, birthCity:chararray, deathYear:int, deathMon:int, deathDay:int, deathCountry:chararray, deathState:chararray, deathCity:chararray);

teams = load '/usr/input/Teams.csv' using org.apache.pig.piggybank.storage.CSVExcelStorage(',', 'NO_MULTILINE', 'UNIX', 'SKIP_INPUT_HEADER') as (year:int, lgID:chararray, tmID:chararray, franchID:chararray, confID:chararray, divID:chararray, rank:chararray, playoff:chararray, g:int, w:int, l:int, t:int, otl:chararray, pts:chararray, sow:chararray, sol:chararray, gf:chararray, ga:chararray, name:chararray, pim:chararray, BenchMinor:chararray, PPG:chararray, PPC:chararray, SHA:chararray, PKG:chararray, PKC:chararray, SHF:chararray);

max_scoring = foreach (group scoring by tmid) generate group as tmid, MAX(scoring.pts) as max_pts;

max_player_pts = foreach(join max_scoring by (tmid,max_pts), scoring by (tmid,pts)) generate playerID as playerID, max_pts as max_pts,  max_scoring::tmid as tmID, year as year, g as goals, a as assists;

player_info = join max_player_pts by playerID, master by playerID;
player_team_info = join player_info by max_player_pts::tmID, teams by tmID;

result = foreach player_team_info generate teams::name as TeamName, player_info::master::firstName as firstName,player_info::master::lastName as lastName, player_info::max_player_pts::year as Year, player_info::max_player_pts::max_pts as Points, player_info::max_player_pts::goals as Goals, player_info::max_player_pts::assists as Assists ;
result = order (distinct result) by TeamName;
dump result
