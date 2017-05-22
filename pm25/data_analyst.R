library(stringr)
library(gdata)
library(plyr)
library(lubridate)
library(plyr)
library(dplyr)
library(ggplot2)
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

# read data with the date period
queryDataWithRange <- function(start='2016-01-01', end='2016-01-01', kpi='AQI') {
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
    # aqi[is.na(aqi)] <- 0
    if (is.na(kpiDF)) {
      kpiDF <- aqi[-c(1:3)]
    } else {
      kpiDF <- rbind(kpiDF , aqi[-c(1:3)])
    }
    kpiMean <- sapply(kpiDF, FUN = mean, na.rm=TRUE)
    kpiDF <- kpiMean
    date <- date + 1
  }
  sub <- data.frame(Date = format(startDate, '%Y-%m-%d'), type = kpi, stringsAsFactors = FALSE)
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
    } else if(category == 'DAY'){
      startDate <- as.Date(str_c(year, '-01-01'))
      endDate <- as.Date(str_c(year, '-12-31'))
      dayNum <- endDate - startDate
      
      for(d in c(rep(1:dayNum))){
        
        md <- queryDataWithRange(startDate,startDate,kpi)
        if (is.na(monthData)) {
          monthData <- md[0,]
        }
        monthData[nrow(monthData) + 1,] <- md[1,]
        startDate <- startDate + 1
      }
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

querySiteDate <- function(site, year='2016', category='MONTH'){
  kpis <- getAllKPIs()
  results <- data.frame(stringsAsFactors = FALSE)
  for(kpi in kpis){
    d <- queryDataForYear(year, kpi, category)
    if(length(colnames(results)) == 0){
      results <- d[c('Date', site)]
      colnames(results) <- c('Date', kpi)
    } else {
      results <- cbind(results, d[site])
      colnames(results) <- c(colnames(results)[1: length(colnames(results))-1], kpi)
    }
  }
  results
}

y <- queryDataForYear('2016', 'PM2.5', 'DAY')
a <- y[c('Date', 'DongSi')]
b <- y[c('Date', 'TongZhou')]
c <- y[c('Date', 'YanQing')]
colnames(a) <- c('Date', 'V')
colnames(b) <- c('Date', 'V')
colnames(c) <- c('Date', 'V')

#ggplot() + geom_line(data = a, aes(x=Date, y=V), col='blue') +geom_line(data = b, aes(x=Date, y=V), col='yellow') + geom_point(data = c, aes(x=Date, y=V), col='red') 

plotData <- function(cols){
  d <- querySiteDate('DongSi', '2016', 'MONTH')
  g <- ggplot()
  for(c in cols){
    g <- g + geom_line(data = d, aes_string(x='Date', y=c, group=1)) + geom_text(aes(x=d$Date[1], y=d[[c]][1], label=c))
  }
  g
}

plotData(c('AQI', 'PM2.5', 'PM10','PM10_24h', 'PM2.5_24h'))

#ggplot() + geom_line(data=d, aes(x=Date, y=CO, group=1, col='blue')) + geom_line(data=d, aes(x=Date, y=AQI, group=1, col='red'))
