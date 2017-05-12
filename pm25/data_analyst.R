library(stringr)

path <- '../beijing_20160101-20161231/'
queryDate <- function(start, end){
  startDate <- as.Date(start)
  endDate <- as.Date(end)
  days <- seq(startDate, endDate, by = "day")
  date <- startDate
  allData <- data.frame()
  while(date <= endDate){
    fileName <- str_c(path, 'beijing_all_', format(date,"%Y%m%d"), '.csv')
    print(str_c('load file ',fileName))
    date <- date + 1
    data <- read.csv(fileName, header = TRUE)
    allData <- rbind(allData, data)
  }
  nrow(allData)
}