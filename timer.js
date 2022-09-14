/**
 * 时间配置函数，此为入口函数，不要改动函数名
 */
 async function scheduleTimer({
    providerRes,
    parserRes
} = {}) {
    return {
        totalWeek: 18, // 总周数：[1, 30]之间的整数
        startSemester: '1661702400000', // 开学时间：时间戳，13位长度字符串，推荐用代码生成
        startWithSunday: false, // 是否是周日为起始日，该选项为true时，会开启显示周末选项
        showWeekend: true, // 是否显示周末
        forenoon: 4, // 上午课程节数：[1, 10]之间的整数
        afternoon: 4, // 下午课程节数：[0, 10]之间的整数
        night: 2, // 晚间课程节数：[0, 10]之间的整数
        sections: [
            { section: 1, startTime: "08:20", endTime: "09:05" },
            { section: 2, startTime: "09:10", endTime: "9:55" },
            { section: 3, startTime: "10:10", endTime: "10:55" },
            { section: 4, startTime: "11:00", endTime: "11:45" },
            { section: 5, startTime: "13:15", endTime: "14:00" },
            { section: 6, startTime: "14:05", endTime: "14:50" },
            { section: 7, startTime: "15:00", endTime: "15:45" },
            { section: 8, startTime: "15:50", endTime: "16:35" },
            { section: 9, startTime: "17:30", endTime: "18:15" },
            { section: 10, startTime: "18:25", endTime: "19:10" }
        ], // 课程时间表，注意：总长度要和上边配置的节数加和对齐
    }

}