
class LineChart{

    constructor(container, options){

        this.container = container;
        this.data;
        this.labels = options.data.labels;

        this.datasets = options.data.datasets;

        this.onclickarr;

        this.cWidth = container.clientWidth;
        this.cHeight = container.clientHeight;

        this.svgGroup = this.createGroup("linechart");
        this.container.appendChild(this.svgGroup);

        this.linesX = 8;
        if (this.cWidth < 375) this.linesX = 4;
        this.linesY = 10;
        this.chartYRange = 0;
        this.chartXRange = 10;

        this.offsetLeft = this.cWidth*0.05;
        this.offsetRight = this.cWidth * 0.95;
        this.offsetBottom = this.cHeight - (Math.round(this.cHeight / this.linesY));

        this._update = this.update.bind(this);
        this._onClick = this.onClick.bind(this);

        window.addEventListener("resize", this._update, false);
        this.init();

        this.container.addEventListener("click", this._onClick, false);

    }

    onClick(event) {

        var parent = event.target.ownerSVGElement;
        if (!parent) parent = event.target;
        
        var hoverpoint = event.target;

        if (hoverpoint.id != "hoverPoint") {
            parent.querySelectorAll(".comment").forEach(comment => {
                comment.style.opacity = 0;
            });
        } else {
            
            var group = hoverpoint.parentNode;

            for (var i = 0; i < group.children.length; i++){
    
                if (group.children[i] == hoverpoint) {
    
                    var comment = parent.querySelectorAll(".comment")[i];
    
                    var cWidth = comment.ownerSVGElement.clientWidth;
        
                    var xPos = comment.children[0].attributes.x.nodeValue;
                    xPos = Math.round(Number(xPos));

                    var rectWidth = Number(comment.children[0].attributes.width.nodeValue);
        
                    if (xPos + rectWidth > cWidth) {
                        for (var o = 0; o < comment.children.length; o++){
                            comment.children[o].style.transform = "translate("+-rectWidth+"px"+",0px)";
                        }
                    }
        
                    comment.style.opacity = 0.9;
    
                }
    
            }

        }

    }

    onMouseOver(num, parent) {
        return function () {

            var comment = parent.querySelectorAll(".comment")[num];

            var cWidth = comment.ownerSVGElement.clientWidth;

            var xPos = comment.children[0].attributes.x.nodeValue;
            xPos = Math.round(Number(xPos));

            var rectWidth = Number(comment.children[0].attributes.width.nodeValue);

            if (xPos + rectWidth > cWidth) {
                for (var i = 0; i < comment.children.length; i++){
                    comment.children[i].style.transform = "translate("+-rectWidth+"px"+",0px)";
                }
            }

            comment.style.opacity = 0.9;

       }
    }

    onMouseOut(num, parent) {
        return function () {
            
            var comment = parent.querySelectorAll(".comment")[num];

            comment.style.opacity = 0;

       }
    }

    test(num) {
        return function () {
            console.log(num);
        }
    }

    setMouseEvents() {

        for (var i = 0; i < this.onclickarr.length; i++){
            
            this.onclickarr[i].onmouseover = this.onMouseOver(i,this.container);
            this.onclickarr[i].onmouseout = this.onMouseOut(i,this.container);

        }

    }

    init() {

        this.onclickarr=[];
        var hoverpointArr = this.createGroup("hoverpointList");
        var commentArr = this.createGroup("commentList");
        var pathArr = this.createGroup("pathList");

        for (var i = 0; i < this.datasets.length; i++){
            
            this.data = this.datasets[i].data;

            var dataName = this.datasets[i].name;
            var linecolor = this.datasets[i].linecolor;
            var pointcolor = this.datasets[i].pointcolor;

            this.setYMax();
            this.setXMax();

            this.drawPath(dataName, pathArr, hoverpointArr, commentArr,linecolor,pointcolor);
            
        }

        this.drawX();
        this.drawY();

        this.svgGroup.append(pathArr);
        this.svgGroup.append(commentArr);
        this.svgGroup.append(hoverpointArr);

        this.setMouseEvents();

    }

    update() {

        this.cWidth = this.container.clientWidth;
        this.cHeight = this.container.clientHeight;
        this.offsetLeft = this.cWidth*0.05;
        this.offsetRight = this.cWidth * 0.95;
        this.offsetBottom = this.cHeight - (Math.round(this.cHeight / this.linesY));

        if (this.cWidth < 375) this.linesX = 4;
        else this.linesX = 8;

        this.svgGroup.innerHTML = "";
        this.init();
        
    }

    setYMax() {

        this.chartYRange = 0;
        this.data.forEach(index => {
            
            if (index > this.chartYRange) this.chartYRange = index;

        });
        this.chartYRange *= 1.2 / 10;
        this.chartYRange = Math.ceil(this.chartYRange);
        this.chartYRange *= 10;
        console.log(this.chartYRange);
    }

    setXMax() {
        
        var dateNow = new Date();

        this.labels.forEach(date => {
            if (typeof date === "string") date = new Date(date);
            if (date < dateNow) dateNow = date;

        });

        var timeDiff = this.differenceInDays(new Date(), dateNow);
        if (timeDiff >= 10) this.chartXRange = timeDiff;
    }

    drawX() {
        
        var xInc = (this.offsetRight - this.offsetLeft) / this.linesX;
        var y1 = this.cHeight / this.linesY * (this.linesY - 1);
        var y2 = this.cHeight * 0.95;

        var dInc = Math.ceil(this.chartXRange / this.linesX);
        var dCount = 0;

        var xAxisLines = this.createGroup("xAxisLines");
        var xChartText = this.createGroup("xChartText");

        for (var i = this.offsetRight; i > 0; i -= xInc){
            
            var line = this.drawLine(i, y1, i, y2);
            xAxisLines.append(line);

            var date = new Date();
            date.setDate(date.getDate() - dCount);
            date = date.toDateString();
            var d1 = date.slice(0, 7);
            var d2 = date.slice(8, 15);
            d1 = this.drawText(d1, i - (xInc / 3), this.cHeight * 0.97);
            d1.classList.add("chartText");
            d2 = this.drawText(d2, i - (xInc / 3), this.cHeight);
            d2.classList.add("chartText");

            xChartText.append(d1);
            xChartText.append(d2);

            dCount += dInc;
        }

        this.svgGroup.append(xAxisLines);
        this.svgGroup.append(xChartText);

    }

    drawY() {
        
        var yInc = this.offsetBottom / this.linesY;
        var yValInc = Math.ceil(this.chartYRange / this.linesY);
        var lineCount = 0;

        var yAxisLines = this.createGroup("yAxisLines");
        var yAxisText = this.createGroup("yAxisText");

        for (var i = this.offsetBottom; i > 0; i -= yInc){
            
            var line = this.drawLine(this.offsetLeft, i, this.offsetRight, i);
            yAxisLines.append(line);

            var yVal = this.drawText(lineCount * yValInc, 0, i);
            yVal.classList.add("chartText");
            yAxisText.append(yVal);
            lineCount++;

        }

        this.svgGroup.append(yAxisLines);
        this.svgGroup.append(yAxisText);

    }

    drawPath(name, pathArr, hoverpointArr, commentArr, linecolor, pointcolor) {
        
        var oneLine = (this.offsetRight - this.offsetLeft) / this.linesX;
        var dateInc = Math.ceil(this.chartXRange / this.linesX);
        var oneDate = oneLine / dateInc;

        var oneYVal = this.offsetBottom / this.chartYRange;

        var path = "";
        var pointList = this.createGroup("pointList");

        for (var i = 0; i < this.data.length; i++) { 

            var xPos = this.differenceInDays(new Date(), this.labels[i]);

            xPos *= oneDate;

            xPos = this.offsetRight - xPos;

            var yPos = oneYVal * this.data[i];
            yPos = this.offsetBottom - yPos;

            path += xPos + " " + yPos + " ";

            var smallPoint = this.drawPoint(xPos, yPos, "basicPoint", 4, pointcolor);
            pointList.append(smallPoint);

            var hoverPoint = this.drawPoint(xPos, yPos, "hoverPoint", 10, linecolor);
            this.onclickarr.push(hoverPoint);
            hoverpointArr.append(hoverPoint);

            var date;
            typeof this.labels[i] === "string" ? date = this.labels[i] : date = this.labels[i].toDateString();

            var data;
            this.data[i] % 1 === 0 ? data = this.data[i] : data = this.data[i].toFixed(3); 

            var comment = this.drawRect(xPos, yPos, name, data, date);
            commentArr.append(comment);

        }

        var p = this.createPath(path, linecolor);
        pathArr.append(p);
        
        this.svgGroup.append(pointList);

    }

    differenceInDays(date1, date2) {
        
        var timeDiff = new Date(date1).getTime() - new Date(date2).getTime();
        timeDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        timeDiff--;
        return timeDiff;

    }

    createPath(data, linecolor) {
        var d = "M" + data + "L";
        var t = document.createElementNS("http://www.w3.org/2000/svg", "path");
        t.setAttribute("d", d);
        t.setAttribute("class", "path");
        t.style.stroke = linecolor;
        return t;
    }

    drawLine(x1, y1, x2, y2) {
        
        var l = document.createElementNS("http://www.w3.org/2000/svg", "line");
        l.setAttribute("x1", x1);
        l.setAttribute("y1", y1);
        l.setAttribute("x2", x2);
        l.setAttribute("y2", y2);
        l.setAttribute("class", "chartLines");
        return l;

    }

    drawPoint(cx, cy, id, r, pointcolor) {

        var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", cx);
        circle.setAttribute("cy", cy);
        circle.setAttribute("id", id);
        circle.setAttribute("r", r);
        circle.style.stroke = pointcolor;
        circle.style.fill = pointcolor;
        return circle;

    }

    drawRect(x, y, name, data, label) {
                
        var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("width", 130);
        rect.setAttribute("height", 38);
        rect.setAttribute("x", x);
        rect.setAttribute("y", y - 19);
        rect.setAttribute("rx", 4);
        rect.setAttribute("ry", 4);

        var dataTxt = this.drawText( name+ ": "+data, x+10, y-4);
        var labelTxt = this.drawText(label, x + 10, y + 11);
        
        var group = this.createGroup("comment");
        group.append(rect);
        group.append(dataTxt);
        group.append(labelTxt);

        return group;
    }

    drawText(text,x,y) {
        var txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
        txt.setAttribute("x", x);
        txt.setAttribute("y", y);
        txt.insertAdjacentHTML("beforeend", text);
        return txt;
    }

    createGroup(className) {
        var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.classList.add(className);
        return g;
    }

}

export { LineChart };