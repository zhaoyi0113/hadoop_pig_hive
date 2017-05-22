library(rpart)
library(rattle)
library(rpart.plot)
library(RColorBrewer)

source('data_analyst.R')

siteData <- querySiteDate('DongSi', '2016', 'DAY') 
siteData[is.na(siteData)] <- 0
dse <- within(siteData, {good = ifelse(AQI<50,1,0)})
tree <- rpart(good ~  PM2.5 + PM10 , dse, method="class")
fancyRpartPlot(tree) 
