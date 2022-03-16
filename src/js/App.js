let genreData = [];
let companyData = [];
let selectedCompanyForScatter = '';

async function main() {
  drawChart1();
  drawChart2();
  drawChart3();
  drawChart4();
}

function drawChart1() {
  const data = window.MOVIE_DATA;
  data.forEach((d) => {
    d.genres.split('|').forEach((g) => {
      let genreItem = genreData.find((it) => it.genre === g);
      if (!genreItem) {
        genreItem = {
          genre: g,
          profit: 0,
        };
        genreData.push(genreItem);
      }
      genreItem.profit += Number(d.profit);
    });
  });

  drawGenreSelectItems();
  drawSvg();

  function drawSvg() {
    // set the dimensions and margins of the graph
    const margin = { top: 20, right: 20, bottom: 100, left: 100 },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    // set the ranges
    const x = d3.scaleBand().range([0, width]).padding(0.1);
    const y = d3.scaleLinear().range([height, 0]);

    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    const svg = d3
      .select('.chart1')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    x.domain(
      genreData.map(function (d) {
        return d.genre;
      })
    );
    y.domain([
      0,
      d3.max(genreData, function (d) {
        return d.profit;
      }),
    ]);
    svg
      .append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('text-anchor', 'start')
      .attr('dx', '1em')
      .attr('dy', '-.5em')
      .attr('transform', 'rotate(90)');
    svg.append('g').call(d3.axisLeft(y));

    const bars = svg.selectAll('.bar').data(genreData);

    bars
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', function (d) {
        return x(d.genre);
      })
      .attr('width', x.bandwidth())
      .attr('y', function (d) {
        return y(d.profit);
      })
      .attr('height', function (d) {
        return Math.max(height - y(d.profit), 0);
      });
    updateChart1Svg();
  }
}

function drawGenreSelectItems() {
  const sorted = [...genreData].sort((a, b) => b.profit - a.profit);

  function calClass(d) {
    return `select-item ${d.selected ? 'selected' : ''}`;
  }

  const selectItems = d3
    .select('.chart1-box .select-box')
    .selectAll('div')
    .data(sorted.slice(0, 10));

  selectItems
    .enter()
    .append('div')
    .attr('class', calClass)
    .text((d) => d.genre)
    .on('click', (d) => {
      d.selected = !d.selected;

      drawGenreSelectItems();
      updateChart1Svg();
    });
  selectItems.attr('class', calClass);
}

function updateChart1Svg() {
  d3.select('.chart1 svg')
    .selectAll('.bar')
    .data(genreData)
    .attr('fill', (d) => (d.selected ? '#785f37' : '#e9dbbd'));
}

function drawChart2() {
  const data = window.MOVIE_DATA;
  data.forEach((d) => {
    d.production_companies.split('|').forEach((company) => {
      let companyItem = companyData.find((it) => it.company === company);
      if (!companyItem) {
        companyItem = {
          company,
          profit: 0,
        };
        companyData.push(companyItem);
      }
      companyItem.profit += Number(d.profit);
    });
  });

  drawCompanyGuessItems();
  drawSvg();

  function drawSvg() {
    // set the dimensions and margins of the graph
    const margin = { top: 20, right: 20, bottom: 220, left: 100 },
      width = 900 - margin.left - margin.right,
      height = 620 - margin.top - margin.bottom;
    const data = [...companyData]
      .sort((a, b) => b.profit - a.profit)
      .slice(0, 20);

    // set the ranges
    const x = d3.scaleBand().range([0, width]).padding(0.1);
    const y = d3.scaleLinear().range([height, 0]);

    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    const svg = d3
      .select('.chart2')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    x.domain(
      data.map(function (d) {
        return d.company;
      })
    );
    y.domain([
      0,
      d3.max(data, function (d) {
        return d.profit;
      }),
    ]);
    svg
      .append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('text-anchor', 'start')
      .attr('dx', '1em')
      .attr('dy', '-.5em')
      .attr('transform', 'rotate(90)');
    svg.append('g').call(d3.axisLeft(y));

    const bars = svg.selectAll('.bar').data(data);

    bars
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', function (d) {
        return x(d.company);
      })
      .attr('width', x.bandwidth())
      .attr('y', function (d) {
        return y(d.profit);
      })
      .attr('height', function (d) {
        return Math.max(height - y(d.profit), 0);
      });
    updateChart2Svg();
  }
}

function updateChart2Svg() {
  const data = [...companyData]
    .sort((a, b) => b.profit - a.profit)
    .slice(0, 20);
  d3.select('.chart2 svg')
    .selectAll('.bar')
    .data(data)
    .attr('fill', (d) => (d.selected ? '#785f37' : '#e9dbbd'));
}

function drawCompanyGuessItems() {
  const sorted = [...companyData].sort((a, b) => b.profit - a.profit);

  function calClass(d) {
    return `select-item ${d.selected ? 'selected' : ''}`;
  }

  const selectItems = d3
    .select('.chart2-box .select-box')
    .selectAll('div.select-item')
    .data(sorted.slice(0, 5));

  selectItems
    .enter()
    .append('div')
    .attr('class', calClass)
    .on('click', (d) => {
      const isSelected = d.selected;
      companyData.forEach((d) => (d.selected = false));
      if (!isSelected) {
        d.selected = true;
      }

      updateChart2Svg();
      drawCompanyGuessItems();
      drawGuessInfo();
    })
    .append('div');

  selectItems.attr('class', calClass);
}

function drawGuessInfo() {
  const sorted = [...companyData].sort((a, b) => b.profit - a.profit);
  const guessInfoEle = d3.select('.chart2-box .guess-info');
  const selectedIndex = sorted.findIndex((d) => d.selected);
  if (selectedIndex < 0) {
    guessInfoEle.text('');
  } else if (selectedIndex === 0) {
    guessInfoEle.text("YOU'RE CORRECT");
  } else {
    guessInfoEle.text(`It's Ranked No.${selectedIndex + 1}`);
  }
}

function drawChart3() {}

function drawChart4() {
  drawCompanySelect();
  drawSvg();

  function drawSvg() {
    const margin = { top: 20, right: 20, bottom: 220, left: 100 },
      width = 900 - margin.left - margin.right,
      height = 620 - margin.top - margin.bottom;

    const data = window.MOVIE_DATA;

    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);
    const div = d3.select('.chart4 .tooltip').style('opacity', 0);

    const svg = d3
      .select('.chart4')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    const minYear = Math.min(...data.map((it) => it.release_year));
    const maxYear = Math.max(...data.map((it) => it.release_year));
    x.domain([d3.timeParse('%Y')(minYear), d3.timeParse('%Y')(maxYear)]);
    y.domain(
      d3.extent(data, function (d) {
        return +d.profit;
      })
    );

    svg
      .append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x));
    svg.append('g').call(d3.axisLeft(y));

    svg
      .append('g')
      .selectAll('.dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', function (d) {
        return x(d3.timeParse('%Y-%m-%d')(d.release_date));
      })
      .attr('cy', function (d) {
        return y(d.profit);
      })
      .attr('r', 4)
      .on('mouseover', function (d) {
        div.transition().duration(200).style('opacity', 0.9);
        div.select('.film-name').text(d['original_title']);
        div
          .select('.companies')
          .text(d.production_companies.split('|').join(', '));
        div.select('.release-date').text(d.release_date);
        div.select('.profit').text(d3.format(',')(d.profit));
        div
          .style('left', d3.event.pageX + 'px')
          .style('top', d3.event.pageY - 28 + 'px');
      })

      // fade out tooltip on mouse out
      .on('mouseout', function (d) {
        div.transition().duration(500).style('opacity', 0);
      });

    updateChart4();
  }
}

function drawCompanySelect() {
  const slicedCompanyData = [...companyData]
    .sort((a, b) => b.profit - a.profit)
    .slice(0, 20);
  const set = new Set(slicedCompanyData.map((it) => it.company));
  const list = ['', ...set];

  const selectDom = document.querySelector(`.company-select`);
  list.forEach((it) => {
    const optionDom = document.createElement('option');
    selectDom.appendChild(optionDom);
    optionDom.innerHTML = it;
    optionDom.value = it;
  });

  selectDom.addEventListener('change', (e) => {
    selectedCompanyForScatter = e.target.value;
    updateChart4();
  });
}

function updateChart4() {
  d3.select('.chart4 svg')
    .selectAll('.dot')
    .data(window.MOVIE_DATA)
    .attr('fill', (d) => {
      if (
        d.production_companies.split('|').includes(selectedCompanyForScatter)
      ) {
        return '#785f37';
      }
      return '#e9dbbd';
    });
}
main();
