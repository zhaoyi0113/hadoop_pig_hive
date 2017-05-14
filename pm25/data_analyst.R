library(stringr)
library(gdata)
library(plyr)
library(lubridate)
library(plyr)
library(dplyr)

source('raw_data.R')

querySingleDayData <- function(date) {
  getDataByDate(date)
}

queryDate <- function(start, end) {
  startDate <- as.Date(start)
  endDate <- as.Date(end)
  days <- seq(startDate, endDate, by = "day")
  date <- startDate
  allData <- data.frame()
  while (date <= endDate) {
    fileName <-
      str_c(path, 'beijing_all_', format(date, "%Y%m%d"), '.csv')
    print(str_c('load file ', fileName))
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
getMeanValueOnEachKPI <- function(datas) {
  total = NA
  for (data in datas) {
    if (is.na(total)) {
      total <- data
    } else{
      for (col in names(data)) {
        if (col != 'date' && col != 'hour' && col != 'type') {
          total[, eval(quote(col))] <-
            total[, eval(quote(col))] + data[, eval(quote(col))]
        }
      }
    }
  }
  total <- total[,!(names(total) %in% c('date', 'hour', 'type'))]
  total <- as.list(colMeans(total))
}

# read data with the date period
queryDataWithRange <- function(start, end, kpi) {
  startDate <- start
  endDate <- end
  if (typeof(startDate) == 'character') {
    startDate <- as.Date(start)
  }
  if (typeof(endDate) == 'character') {
    endDate <- as.Date(end)
  }
  
  days <- seq(startDate, endDate, by = "day")
  date <- startDate
  kpis <- list()
  kpiDF <- NA
  while (date <= endDate) {
    data <- querySingleDayData(date)
    aqi <- data[[kpi]]
    aqi[is.na(aqi)] <- 0
    if (is.na(kpiDF)) {
      kpiDF <- aqi[-c(1:3)]
    } else {
      kpiDF <- rbind(kpiDF , aqi[-c(1:3)])
    }
    kpiMean <- sapply(kpiDF, FUN = mean)
    kpiDF <- kpiMean
    date <- date + 1
  }
  sub <- data.frame(Date = startDate, type = kpi)
  kpiDF <- cbind(sub, t(kpiDF))
  kpiDF
}

# query data for the given month
queryDataForMonth <-
  function(year = '2016',
           month = '01',
           kpi = 'AQI') {
    startDate <- as.Date(str_c(year, '-', month, '-01'))
    endDate <- NA
    if (typeof(month) == 'character') {
      month <- as.numeric(month)
    }
    if (month < 12) {
      endDate <- as.Date(str_c(year, '-', month + 1, '-01')) - 1
    } else{
      endDate <- as.Date(str_c(year, '-12-31'))
    }
    queryDataWithRange(startDate, endDate, kpi)
  }

# group data by month
queryDataForYear <-
  function(year = '2016',
           kpi = 'AQI',
           category = 'MONTH') {
    monthData <- NA
    if (category == 'QUARTER') {
      for (m in c(rep(1:4))) {
        md <- NA
        md <- queryDataForQuarter(year, str_c(m), kpi)
        if (is.na(monthData)) {
          monthData <- md[0,]
        }
        monthData[nrow(monthData) + 1,] <- md[1,]
      }
    } else if (category == 'YEAR') {
      startDate <- str_c(year, '-01-01')
      endDate <- str_c(year, '-12-31')
      monthData <- queryDataWithRange(startDate, endDate, kpi)
    }
    else {
      for (m in c(rep(1:12))) {
        md <- NA
        md <- queryDataForMonth(year, m, kpi)
        if (is.na(monthData)) {
          monthData <- md[0,]
        }
        monthData[nrow(monthData) + 1,] <- md[1,]
      }
    }
    monthData
  }

queryDataForQuarter <-
  function(year = '2016',
           quarter = '1',
           kpi = 'AQI') {
    startDate <- NA
    endDate <- NA
    if (quarter == '1') {
      startDate <- as.Date(str_c(year, '-01-01'))
      endDate <- as.Date(str_c(year, '-03-31'))
    } else if (quarter == '2') {
      startDate <- as.Date(str_c(year, '-04-01'))
      endDate <- as.Date(str_c(year, '-06-30'))
    } else if (quarter == '3') {
      startDate <- as.Date(str_c(year, '-07-01'))
      endDate <- as.Date(str_c(year, '-09-30'))
    } else if (quarter == '4') {
      startDate <- as.Date(str_c(year, '-10-01'))
      endDate <- as.Date(str_c(year, '-12-31'))
    }
    print(str_c('query data ', startDate, endDate, kpi))
    queryDataWithRange(startDate, endDate, kpi)
  }
