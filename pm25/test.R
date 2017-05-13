pm <- read.csv('../beijing_20160101-20161231/beijing_all_20160101.csv', header = TRUE)
head(pm)

pm25 <- pm[pm$type == 'PM2.5',]
head(pm25)

pm2524h <- pm[pm$type == 'PM2.5_24h',]
barplot(pm25$东四)

type <- 'AQI'
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
rowSums(dat[,c("sid")])

pheno <- data.frame(
  snpname=rep(letters[1:2],2),
  sid=rep(1:2,each=2), 
  genotype=rep(c('aa','ab'), 2)
)
pheno
all <- data.frame()
rbind(all, dat, pheno)
library(plyr)

ddply(cbind(name=c(rownames(dat), rownames(pheno)), rbind.fill(list(dat, pheno))), .(snpname, genotype), summarise, sid=sum(sid))

install.packages('gdata')

source('data_analyst.R')
date <- querySingleDayData(as.Date('2016-01-01'))
date2 <- querySingleDayData(as.Date('2016-01-02'))

library(ggplot2)
str(date[['AQI']])

aqi <- date[['AQI']]
aqi2 <- date2[['AQI']]

total <- getTotalValue(list(aqi, aqi2))
names(total)
ggplot(aqi, aes(x = DongSi, y = factor(hour), col=hour, size=DongSi)) + geom_point()
ggplot(aqi, aes(x = DongSi, y = factor(hour), col=hour, size=DongSi)) +  geom_point() + geom_smooth()
