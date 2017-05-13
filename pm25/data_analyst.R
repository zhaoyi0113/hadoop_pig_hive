library(stringr)
library(gdata)
library(plyr)

path <- '../beijing_20160101-20161231/'

changeColumnName <- function(data){
  data = rename.vars(data, from = '东四', to = 'DongSi' )
  data = rename.vars(data, from = '天坛', to = 'TianTan')
  
}

querySingleDayData <- function(date){
  fileName <- str_c(path, 'beijing_all_', format(date,"%Y%m%d"), '.csv')
  print(str_c('load file ',fileName))
  data <- read.csv(fileName, header = TRUE)
  data <- changeColumnName(data)
  split(data, data$type)
}

queryDate <- function(start, end){
  startDate <- as.Date(start)
  endDate <- as.Date(end)
  days <- seq(startDate, endDate, by = "day")
  date <- startDate
  allData <- data.frame()
  while(date <= endDate) {
    fileName <- str_c(path, 'beijing_all_', format(date,"%Y%m%d"), '.csv')
    print(str_c('load file ',fileName))
    data <- read.csv(fileName, header = TRUE)
    date <- date + 1
    allData <- rbind(allData, data)
  }
  allData <- changeColumnName(allData)
  split(allData, allData$type)
}

##
# add all kpi values from the list
##
getTotalValue <- function(datas){
  total = NA
  for(data in datas){
    if(is.na(total)){
      total <- data
    }else{
      for(col in names(data)){
        if( col != 'date' && col != 'hour' && col != 'type'){
            total[, eval(quote(col))] <- total[, eval(quote(col))] + data[, eval(quote(col))]
        }
      }
    }
    
  }
  total
}

queryDataWithSum <- function(start, end, kpi){
  startDate <- start
  endDate <- end
  if(typeof(startDate) == 'character'){
    startDate <- as.Date(start)
  }
  if(typeof(endDate) == 'character'){
    endDate <- as.Date(end)
  }
  
  days <- seq(startDate, endDate, by = "day")
  date <- startDate
  kpis <- list()
  while(date <= endDate) {
    fileName <- str_c(path, 'beijing_all_', format(date,"%Y%m%d"), '.csv')
    data <- querySingleDayData(date)
    aqi <- data[[kpi]]
    kpis[[length(kpis) + 1]] <- aqi
    date <- date + 1
  }
  getTotalValue(kpis)
}

# query data for the given month
queryDataForMonth <- function(year, month, kpi){
  startDate <- as.Date(str_c(year,'-',month,'-01'))
  endDate <- NA
  if(month < 12){
    endDate <- as.Date(str_c(year,'-',month+1,'-01')) - 1
  }else{
    endDate <- as.Date(str_c(year,'-12-31'))
  }
  queryDataWithSum(startDate, endDate, kpi)
}

# group data by month
queryDataByMonth <- function(year, kpi){
  startDate = as.Date(str_c(year, '-01-01'))
  endDate = as.Date(str_c(year, '-01-31'))
  monthData <- list()
  for(m in c(rep(1:12))){
    print(str_c('query data for month ',year,m))
    md <- queryDataForMonth(year, m, kpi)
    cn <- str_c(year,'-',m)
    monthData[[cn]] <- md
  }
  monthData
}

