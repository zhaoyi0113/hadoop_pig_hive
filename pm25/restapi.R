
#source('test.R')
source('data_analyst.R')

#* @get /mean
normalMean <- function(samples=10){
  data <- rnorm(samples)
  mean(data)
}

#* @get /data/monthly
getMonthlyData <- function(year = '2016', kpi = 'AQI'){
  data <- queryDataByMonth(year, kpi)
  toJSON(d)
}

#* @get /data/month
getMonthData <- function(year = '2016', month='01', kpi='AQI'){
  data <- queryDataForMonth(year, month, kpi)
  toJSON(d)
}


#* @post /sum
addTwo <- function(a, b){
  as.numeric(a) + as.numeric(b)
}
