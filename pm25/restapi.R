library(jsonlite)

#source('test.R')
source('data_analyst.R')


#* @get /data/year
getMonthlyData <- function(year = '2016', kpi = 'AQI', category='MONTH'){
  data <- queryDataForYear(year, kpi, category)
  data[is.na(data)] <- 0
  toJSON(data)
}

#* @get /data/month
getMonthData <- function(year = '2016', month='01', kpi='AQI'){
  data <- queryDataForMonth(year, month, kpi)
  toJSON(data)
}

#* @get /data/quarter
getQuarterData <- function(year = '2016', quarter='1', kpi='AQI'){
  data <- queryDataForQuarter(year, quarter, kpi)
  toJSON(data)
}

#* @get /districts
getDistricts <- function() {
  data <- names((cachedData[[1]][1])[[1]])[-c(1:3)]
  
  toJSON(data)
}
#* @get /data/site
getSiteData <- function(site, year='2016', category='MONTH'){
  data <- querySiteDate(site, year, category)  
  #data[is.na(data)] <- 0
  #toJSON(data)
}

#* @post /sum
addTwo <- function(a, b){
  as.numeric(a) + as.numeric(b)
}
