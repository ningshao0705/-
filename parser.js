function scheduleHtmlParser(html) {
	//定义最终result数组
	var result=[];
    var $ = cheerio.load(html, { decodeEntities: false });
	//遍历每一横排tr
	$("#Table1 tr").each(
	function (i) {
		//i>1意味着索引2即从第三行开始
		if (i > 1) {
		//遍历每横排的每个格子，七天加一个表头共8列，故j输出（0,7），正好对应星期
		//大学两节课连上，目前只能截取1，3，5，7，9课，稍后合并1，2...
			$(this).children('td').each(function (j) {
				//因为存在合并单元格，所以上午，下午，晚上的第一节课（1，5，9）对应这一横行的2索引，而3，7节对应1索引，所以下面要添加一个判断
				 if ((i - 1) == 1 || (i - 1) == 5 || (i - 1) == 9) {
					if ((j - 1) > 0) {
						console.log("第"+(i-1)+"节课，星期"+(j-1)+"课程名称："+$(this).html());
							//执行课程解析函数
						var classObj = getClass($(this).html(), (j-1), (i - 1));
						//拼接到result里面,判断是否为空，如果为空，getClass不执行，所以不添加classObj到里面result
						if(typeof(classObj)!="undefined"){
								console.log(classObj.length);//同一课程不同教室会大于1
							if (classObj.length>1){//双课程
								console.log("这是双课程");
								//分别加到result里面
								result.push(classObj[0]);
								result.push(classObj[1]);
							}
							else{//普通课程
								result.push(classObj);
								console.log("这是普通课程");
							}
										
						}
					}
				}
				 else if ((i - 1) == 3 || (i - 1) == 7) {
					if (j > 0) {
						console.log("第"+(i-1)+"节课，星期"+(j)+"课程名称："+$(this).html());
						//执行课程解析函数
						var classObj = getClass($(this).html(), j, (i - 1));
						//拼接到result里面,判断是否为空，如果为空，getClass不执行，所以不添加classObj到result里面
						if(typeof(classObj)!="undefined"){
							console.log(classObj.length);//同一课程不同教室会返回2
							if (classObj.length>1){//双课程
								console.log("这是双课程");
								result.push(classObj[0]);
								result.push(classObj[1]);
							}
							else{//普通课程
								result.push(classObj);
								console.log("这是普通课程");
							}
						}
					}
				}

			}
			)
		}
    }
    )
	//返回最终result
	return result;
}




//定义课程解析函数
function getClass(classHtml, day, section) {
    var classs = classHtml.split('<br>');
	//console.log(classs);
	//这里判断是否一个课程根据单双周不一个教室（双课程）,上面是单，下面是双
    if (classs.length < 6&&classs.length>1) { //防止空课,空nbsp长度为1
		console.log("这是单课程");
		//这里严格遵守返回格式
		var classObj = {};
		classObj.name = classs[0];
		classObj.position = classs[4];
		classObj.teacher = classs[3];
		classObj.weeks = getWeeks(classs[2]);
		classObj.day = day;
		classObj.sections = [];
		//一节课时间是两节，这里进行合并
		classObj.sections.push(section);
		classObj.sections.push(section+1);
		return classObj;			 
    }
	else if (classs.length > 6){
		console.log("这是双课程");
		//console.log(classs);
		//默认上面为单周
		var classObj = {};
		classObj.name = classs[0];
		classObj.position = classs[4];
		classObj.teacher = classs[3];
		classObj.weeks = getWeeks(classs[2]);
		classObj.day = day;
		classObj.sections = [];
		//一节课时间是两节，这里进行合并
		classObj.sections.push(section);
		classObj.sections.push(section+1);

		// //双周向里面添加数据
		var class2 = {};
		class2.name = classs[6];
		class2.position = classs[10];
		class2.teacher = classs[9];
		class2.weeks = getWeeks(classs[8]);
		class2.day = day;
		class2.sections = [];
		//一节课时间是两节，这里进行合并
		class2.sections.push(section);
		class2.sections.push(section+1);
		//把双周class2字典加入classObj里面
		var classObj1=[classObj,class2];
		return classObj1;		
	}   
}



//单双周
function getWeeks(weeksHtml) {
	var weeks=[];//定义weeks数组
	var weeksStr = weeksHtml;
	//开始分割
	var data1=weeksHtml.split("{");
	var data2=data1[1].split("}");
	//data2[0]格式为  第5-18周|单周或第5-18周，下面需要判断是否单双周
	 //不需要正则去掉“第”和“周”，用"-"分割
	 data3=data2[0].split("第");
	 data4=data3[1].split("周");
	 data5=data4[0].split("-");
	 week_start=parseInt(data5[0]);//转化整型以遍历
	 week_end=parseInt(data5[1])+1;
	if(data2[0].indexOf('|') == -1){//正常周
		console.log("这是正常周");
		//开始遍历
		for(var i=0;i<week_end;i++){
			if(i>=week_start){
				weeks.push(i);
			}
		}
	}
	else{
		if (data2[0].indexOf('单') != -1){
			console.log("这是单周");
			for(var i=1;i<week_end;i=i+2){
				if(i>=week_start){
					weeks.push(i);
				}
			}
		}
		else{
			console.log("这是双周");
			for(var i=0;i<week_end;i=i+2){
				if(i>=week_start){
				weeks.push(i);
				}
			}	
		}
	}
	return weeks;
}
