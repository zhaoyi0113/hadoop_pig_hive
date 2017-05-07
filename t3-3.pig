
scoring = load '/usr/input/Scoring.csv' using org.apache.pig.piggybank.storage.CSVExcelStorage(',', 'NO_MULTILINE', 'UNIX', 'SKIP_INPUT_HEADER') as (playerID:chararray, year:int, stint:int, tmid:chararray, lgid:chararray, pos:chararray, gp:int, g:int, a:int, pts:int, pim:int, plusminus:int, ppg:int, ppa:int, shg:int, sha:int, gqg:int, gtg:int, sog:int, postgp:int, postg:int, posta:int, postpts:int, postpim:int, postplusminus:int, postppg:int, postppa:int, postshq:int,postsha:int, postgwg:int, postsog:int);

master = load '/usr/input/Master.csv' using org.apache.pig.piggybank.storage.CSVExcelStorage(',', 'NO_MULTILINE', 'UNIX', 'SKIP_INPUT_HEADER') as (playerID:chararray, coachID:chararray, hofID:chararray, firstName:chararray, lastName:chararray, nameNote:chararray, nameGiven:chararray, nameNick:chararray, height:int, weight:int, shootCatch:chararray, legendsID:chararray, ihdbID:int, hrefID:chararray, firstNHL:int, lastNHL:int, firstWHA:int, lastWHA:int, pos:chararray, birthYear:int, birthMon:int, birthDay:int, birthCountry:chararray, birthState:chararray, birthCity:chararray, deathYear:int, deathMon:int, deathDay:int, deathCountry:chararray, deathState:chararray, deathCity:chararray);

teams = load '/usr/input/Teams.csv' using org.apache.pig.piggybank.storage.CSVExcelStorage(',', 'NO_MULTILINE', 'UNIX', 'SKIP_INPUT_HEADER') as (year:int, lgID:chararray, tmID:chararray, franchID:chararray, confID:chararray, divID:chararray, rank:chararray, playoff:chararray, g:int, w:int, l:int, t:int, otl:chararray, pts:chararray, sow:chararray, sol:chararray, gf:chararray, ga:chararray, name:chararray, pim:chararray, BenchMinor:chararray, PPG:chararray, PPC:chararray, SHA:chararray, PKG:chararray, PKC:chararray, SHF:chararray);

coaches = load '/usr/input/Coaches.csv' using org.apache.pig.piggybank.storage.CSVExcelStorage(',', 'NO_MULTILINE', 'UNIX', 'SKIP_INPUT_HEADER') as (coachID:chararray, year:int, tmID:chararray, lgID:chararray, stint:int, notes:chararray, G:int, W:int, L:int,T:int, PostG:int, PostW:int, PostL:int, PostT:int);

awardscoaches = load '/usr/input/AwardsCoaches.csv' using org.apache.pig.piggybank.storage.CSVExcelStorage(',', 'NO_MULTILINE', 'UNIX', 'SKIP_INPUT_HEADER') as (coachID:chararray, award:chararray, year:int, lgID:chararray, note:chararray);

coach_award = foreach (group awardscoaches by coachID) generate group as coachID, COUNT(awardscoaches.award) as award;

c = foreach (join coach_award by coachID, coaches by coachID) generate 
    coach_award::coachID as coachID, coach_award::award as award,  coaches::tmID as tmID, coaches::W as Win;

d = foreach (group c by tmID) generate group as tmID, MAX(c.award) as award;

e = foreach (join c by (tmID, award), d by (tmID, award)) generate 
    c::coachID as coachID,  c::tmID as tmID, c::Win as Win, d::award as award;

f = foreach (group e by (tmID, coachID, award)) generate flatten(group) as(tmID, coachID, award), MAX(e.Win) as Win ;

coach_master = foreach (join f by coachID, master by coachID) generate f::coachID as coachID, 
    f::award as award, f::tmID as tmID, master::firstName as firstName, master::lastName as lastName, f::Win as Win;


coach_team_master = distinct (foreach (join coach_master by tmID, teams by tmID) 
    generate teams::name as Name, coach_master::firstName as firstName, coach_master::lastName as lastName, 
    coach_master::award as award, coach_master::Win as Win);

result = order coach_team_master by Name;
dump result