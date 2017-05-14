library(stringr)
library(gdata)
library(plyr)
library('lubridate')
library(plyr)
library(dplyr)

path <- '../beijing_20160101-20161231/'

changeColumnName <- function(data) {
  data = rename.vars(data, from = '东四', to = 'DongSi')
  data = rename.vars(data, from = '天坛', to = 'TianTan')
  data = rename.vars(data, from = '官园', to = 'GuanYuan')
  data = rename.vars(data, from = '万寿西宫', to = 'WanShouXiGong')
  data = rename.vars(data, from = '奥体中心', to = 'AoTiZhongXin')
  data = rename.vars(data, from = '农展馆', to = 'NongZhanGuan')
  data = rename.vars(data, from = '万柳', to = 'WanLiu')
  data = rename.vars(data, from = '北部新区', to = 'BeibuXinqu')
  data = rename.vars(data, from = '植物园', to = 'ZhiWuYuan')
  data = rename.vars(data, from = '丰台花园', to = 'FengTaiHuaYuan')
  data = rename.vars(data, from = '云岗', to = 'YunGang')
  data = rename.vars(data, from = '古城', to = 'GuCheng')
  data = rename.vars(data, from = '房山', to = 'FangShan')
  data = rename.vars(data, from = '大兴', to = 'DaXing')
  data = rename.vars(data, from = '顺义', to = 'ShunYi')
  data = rename.vars(data, from = '亦庄', to = 'YiZhuang')
  data = rename.vars(data, from = '通州', to = 'TongZhou')
  data = rename.vars(data, from = '昌平', to = 'ChangPing')
  data = rename.vars(data, from = '门头沟', to = 'MenTouGou')
  data = rename.vars(data, from = '平谷', to = 'PingGu')
  data = rename.vars(data, from = '怀柔', to = 'HuaiRou')
  data = rename.vars(data, from = '密云', to = 'MiYun')
  data = rename.vars(data, from = '延庆', to = 'YanQing')
  data = rename.vars(data, from = '定陵', to = 'DingLing')
  data = rename.vars(data, from = '八达岭', to = 'BaDaLin')
  data = rename.vars(data, from = '密云水库', to = 'MiYunShuiKu')
  data = rename.vars(data, from = '东高村', to = 'DongGaoCun')
  data = rename.vars(data, from = '永乐店', to = 'YongLeDian')
  #data = rename.vars(data, from = '东高村', to = 'DongGaoCun')
  data = rename.vars(data, from = '榆垡', to = 'YuFa')
  data = rename.vars(data, from = '琉璃河', to = 'LiuLiHe')
  data = rename.vars(data, from = '前门', to = 'QianMen')
  data = rename.vars(data, from = '永定门内', to = 'YongDingMenNei')
  data = rename.vars(data, from = '西直门北', to = 'XiZhiMenBei')
  data = rename.vars(data, from = '南三环', to = 'NanSanHuan')
  data = rename.vars(data, from = '东四环', to = 'DongSiHuan')
  
}

querySingleDayData <- function(date) {
  fileName <-
    str_c(path, 'beijing_all_', format(date, "%Y%m%d"), '.csv')
  print(str_c('load file ', fileName))
  data <- read.csv(fileName, header = TRUE)
  data[is.na(data)] <- 0
  data <- changeColumnName(data)
  split(data, data$type)
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
  total <- total[, !(names(total) %in% c('date', 'hour', 'type'))]
  total <- as.list(colMeans(total))
}

# read data with the date period
queryDataWithSum <- function(start, end, kpi) {
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
    fileName <-
      str_c(path, 'beijing_all_', format(date, "%Y%m%d"), '.csv')
    data <- querySingleDayData(date)
    aqi <- data[[kpi]]
    aqi[is.na(aqi)] <- 0
    if (is.na(kpiDF)) {
      kpiDF <- aqi[-c(1:3)]
    } else {
      kpiDF <- kpiDF + aqi[-c(1:3)]
    }
    
    #kpiDF <- ddply(merge(kpiDF, aqi, all=TRUE), .('date', 'hour', 'type'), summarise, )
    
    
    #kpiDF[is.na(kpiDF)] <- 0
    kpiMean <- sapply(kpiDF, FUN = mean)
    kpiDF <- kpiMean
    
    date <- date + 1
  }
  sub <- data.frame(Date = format(startDate, format = '%Y%m%d'), type = kpi)
  kpiDF <- cbind(sub, t(kpiMean))
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
    queryDataWithSum(startDate, endDate, kpi)
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
          monthData <- md[0, ]
        }
        monthData[nrow(monthData) + 1, ] <- md[1, ]
      }
    } else {
      for (m in c(rep(1:12))) {
        md <- NA
        md <- queryDataForMonth(year, m, kpi)
        if (is.na(monthData)) {
          monthData <- md[0, ]
        }
        monthData[nrow(monthData) + 1, ] <- md[1, ]
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
    queryDataWithSum(startDate, endDate, kpi)
  }
