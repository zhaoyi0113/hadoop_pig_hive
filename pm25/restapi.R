
#source('test.R')
source('data_analyst.R')

#* @get /mean
normalMean <- function(samples=10){
  data <- rnorm(samples)
  mean(data)
}

#* @get /data/year
getMonthlyData <- function(year = '2016', kpi = 'AQI', category='MONTH'){
  data <- queryDataForYear(year, kpi, category)
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

#* @post /sum
addTwo <- function(a, b){
  as.numeric(a) + as.numeric(b)
}
