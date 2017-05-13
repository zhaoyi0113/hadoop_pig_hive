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

