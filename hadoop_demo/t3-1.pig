


teams = load '/usr/input/Teams.csv' using org.apache.pig.piggybank.storage.CSVExcelStorage(',', 'NO_MULTILINE', 'UNIX', 'SKIP_INPUT_HEADER') as (year:int, lgID:chararray, tmID:chararray, franchID:chararray, confID:chararray, divID:chararray, rank:chararray, playoff:chararray, g:int, w:int, l:int, t:int, otl:chararray, pts:chararray, sow:chararray, sol:chararray, gf:chararray, ga:chararray, name:chararray, pim:chararray, BenchMinor:chararray, PPG:chararray, PPC:chararray, SHA:chararray, PKG:chararray, PKC:chararray, SHF:chararray);


grp_by_team = group teams by name;

wins = foreach grp_by_team generate group as team, SUM(teams.g) as wins;
losses = foreach grp_by_team generate group as team, SUM(teams.l) as losses;
ties = foreach grp_by_team generate group as team, SUM(teams.t) as ties;

join_sum = join wins by team, losses by team, ties by team;

result = order(foreach join_sum generate $0 as team, $1 as wins, $3 as losses, $5 as ties) by team;
dump result
