pm <- read.csv('../beijing_20160101-20161231/beijing_all_20160101.csv', header = TRUE)
head(pm)

pm25 <- pm[pm$type == 'PM2.5',]
head(pm25)

pm2524h <- pm[pm$type == 'PM2.5_24h',]
barplot(pm25$东四)

pm_by_type <- split(pm, pm$type)
head(pm_by_type)
summary(pm_by_type)

head(pm_by_type[['AQI']])

summary(pm_by_type)
path <- '../'

dat <- data.frame(
  snpname=rep(letters[1:2],2),
  sid=rep(1:2,each=2), 
  genotype=rep(c('aa','ab'), 2)
)
dat
pheno <- data.frame(
  snpname=rep(letters[1:2],2),
  sid=rep(1:2,each=2), 
  genotype=rep(c('aa','ab'), 2)
)
pheno
all <- data.frame()
rbind(all, dat, pheno)

source('data_analyst.R')
queryDate('2016-01-01', '2016-03-13')
