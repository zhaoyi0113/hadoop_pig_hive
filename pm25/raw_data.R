library(stringr)
library(gdata)
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
  data = rename.vars(data, from = '八达岭', to = 'BaDaLing')
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


loadData <- function(year) {
  cachedData <- list()
  startDate <- as.Date(str_c(year, '-01-01'))
  endDate <- as.Date(str_c(year, '-12-31'))
  while (startDate <= endDate) {
    strDate <- format(startDate, '%Y%m%d')
    fileName <-
      str_c(path, 'beijing_all_', strDate, '.csv')
    data <- read.csv(fileName, header = TRUE)
    #data[is.na(data)] <- 0
    data <- changeColumnName(data)
    dataExtra <-
      read.csv(str_c(path, 'beijing_extra_', strDate, '.csv'))
    dataExtra <- changeColumnName(dataExtra)
    print(str_c('load file:', path, 'beijing_all_', strDate, '.csv'))
    allData <- rbind(data, dataExtra)
    for(i in 1:ncol(allData)){
      allData[is.na(allData[,i]), i] <- mean(allData[,i], na.rm = TRUE)
    }
    s <- split(allData, allData$type)
    cachedData[[strDate]] <- s
    startDate <- startDate + 1
  }
  cachedData
}
cachedData <- loadData('2016')
getDataByDate <- function(date) {
  strDate <- format(date, '%Y%m%d')
  cachedData[[strDate]]
}
getDistricts <- function() {
  names((cachedData[[1]][1])[[1]])[-c(1:3)]
}

getAllKPIs <- function() {
  names(cachedData[[1]])
}

# get each kpi mean value through whole year
queryKpiMeanValue <- function() {
  kpis <- getAllKPIs()
  
  kpiValue <- list()
  
  for (kpi in kpis) {
    for (date in cachedData) {
      sitesKpi <- date[kpi][[1]] # all site for this kpi
      sitesKpi <- sitesKpi[c(-1,-2,-3)]
      sitesKpi[is.na(sitesKpi)] <- 0
      kpiValue[[kpi]] <-
        mean(c(kpiValue[[kpi]], mean(as.matrix(sitesKpi))))
      
    }
  }
  return(kpiValue)
  
}

kpiMeanData <- queryKpiMeanValue()

# get kpi data for the whole year by month
queryKpisMonthlyData <- function() {
  kpis <- getAllKPIs()
  kpisMonthlyData <- list()
  for (kpi in kpis) {
    kpisMonthlyData[[kpi]] <- vector()
    for (m in c(rep(1:12))) {
      month <- str_c('2016-', m)
      startDate = as.Date(str_c(month, '-01'))
      if (m == 12) {
        endDate = as.Date(str_c('2017-01-01'))
      } else{
        endDate = as.Date(str_c('2016-', m + 1, '-01')) - 1
      }
      meanValue <- 0
      for (dateName in names(cachedData)) {
        date <- as.Date(dateName, '%Y%m%d')
        if (date < startDate || date > endDate) {
          next
        }
        sitesKpi <- cachedData[[dateName]][kpi][[1]] # all sites for this kpi
        sitesKpi <- sitesKpi[c(-1,-2,-3)]
        sitesKpi[is.na(sitesKpi)] <- 0
        meanValue <- mean(c(meanValue, mean(as.matrix(sitesKpi), na.rm = FALSE)))
      }
      length <- length(kpisMonthlyData[[kpi]])
      kpisMonthlyData[[kpi]][length + 1] <- meanValue
    }
  }
  return(kpisMonthlyData)
}

# get kpi data for the whole year
queryKpisDailyData <- function() {
  kpis <- getAllKPIs()
  kpiValue <- list()
  for (kpi in kpis) {
    kpiValue[[kpi]] <- c()
    for (date in cachedData) {
      sitesKpi <- date[kpi][[1]] # all site for this kpi
      sitesKpi <- sitesKpi[c(-1, -2, -3)]
      
      for(i in 1:ncol(sitesKpi)){
        sitesKpi[is.na(sitesKpi[,i]), i] <- mean(sitesKpi[,i], na.rm = TRUE)
      }
      #sitesKpi[is.na(sitesKpi)] <- 0
      kpiValue[[kpi]][length(kpiValue[[kpi]]) + 1] <-
        mean(as.matrix(sitesKpi))
      
    }
  }
  return(kpiValue)
}

queryKpiBySite <- function(){
  kpis <- getAllKPIs()
  kpiValue <- list()
  for (kpi in kpis) {
    kpiValue[[kpi]] <- list()
    for (date in cachedData) {
      sitesKpi <- date[kpi][[1]] # all site for this kpi
      sitesKpi <- sitesKpi[c(-1, -2, -3)]
      for(i in 1:ncol(sitesKpi)){
        sitesKpi[is.na(sitesKpi[,i]), i] <- mean(sitesKpi[,i], na.rm = TRUE)
      }
      #sitesKpi[is.na(sitesKpi)] <- mean(as.matrix(sitesKpi))
      for (siteName in names(sitesKpi)){
        if(length(kpiValue[[kpi]][[siteName]] == 0)){
          kpiValue[[kpi]][[siteName]] <- mean(as.matrix(sitesKpi[siteName]))
        }else{
          kpiValue[[kpi]][[siteName]] <- mean(c(kpiValue[[kpi]][[siteName]] , mean(as.matrix(sapply(sitesKpi[siteName], as.numeric)))))
        }
      }
    }
  }
  
  return(kpiValue)
}

kpisData <- queryKpisDailyData()
kpisMonthlyData <- queryKpisMonthlyData()
kpisSiteData <- queryKpiBySite()