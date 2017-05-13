library(stringr)
library(gdata)
library(plyr)
library('lubridate')
library(plyr)

path <- '../beijing_20160101-20161231/'

changeColumnName <- function(data){
  data = rename.vars(data, from = '东四', to = 'DongSi' )
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

querySingleDayData <- function(date){
  fileName <- str_c(path, 'beijing_all_', format(date,"%Y%m%d"), '.csv')
  print(str_c('load file ',fileName))
  data <- read.csv(fileName, header = TRUE)
  data[is.na(data)] <- 0
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
getMeanValueOnEachKPI <- function(datas){
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
  total <- total[, !(names(total) %in% c('date', 'hour', 'type'))]
  total <- colMeans(total)
}

# read data with the date period
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
  getMeanValueOnEachKPI(kpis)
}

# query data for the given month
queryDataForMonth <- function(year, month, kpi){
  startDate <- as.Date(str_c(year,'-',month,'-01'))
  endDate <- NA
  if(typeof(month) == 'character'){
    month <- as.numeric(month)
  }
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

