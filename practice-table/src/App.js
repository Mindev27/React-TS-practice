// https://ko.react.dev/learn/thinking-in-react
// 위의 React공식문서의 예제를 분석했습니다. 가볍게 주석만 적음

import {useState} from 'react'

// 이녀석은 카테고리를 나타내는것
function ProductCategoryRow({category}) {
  // colSpan은 열을 몇개 합쳐서 적을거냐라는뜻임
  // 2이면 아래 열이 2개니까 합쳐서 적겠다 라는느낌
  return (
    <tr>
      <th colSpan="2">{category}</th>
    </tr>
  )
}

// 요건 이제 이름과 가격을 나타내는 줄임
function ProductRow({product}) {
  // 일단 이름은 stocked 즉 재고가 있으면 걍 이름, 없다면 빨간색으로 넣어버려
  const name = product.stocked ? (
    product.name
  ) : (
    <span style={{color: 'red'}}>{product.name}</span>
  )

  // table row로 넣으면서 table data (td)를 넣어준다.
  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  )
}

// 하단의 테이블
// rows에는 각 줄에 대한 정보가 들어갈듯
function ProductTable({products, filterText, inStockOnly}) {
  const rows = []
  let lastCategory = null // 얘가 가장 마지막 Category를 관리하면서 종류가 바뀌는것을 감지

  // 일단 각각의 product에 대해서 forEach를 돎 하나의 product로 보는듯
  products.forEach(product => {
    if (product.name.toLowerCase().indexOf(filterText.toLowerCase()) === -1) {
      return
    }
    if (inStockOnly && !product.stocked) {
      return
    }
    if (product.category !== lastCategory) {
      rows.push(<ProductCategoryRow category={product.category} key={product.category} />)
    }
    rows.push(<ProductRow product={product} key={product.name} />)
    lastCategory = product.category
  })

  // 여기까지 왔다면 이제 row안에는 각각의 줄이 다 들어있음

  // table태그로 감고 table head (thead)로 감싸
  // thead안에는 table row (tr)이 있음
  // 각 줄에 대해서 table header (th) 에는 이름과 가격을 넣음
  // 이제 tbody에 각 줄들을 넣음
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  )
}

// 요건 검색바
// form태그로 입력을 할 수 있고, input태그? 입력을 받는 태그인듯
// 안에 type은 text는 텍스트를 입력받겠다. 다른것도 가능
// placeholder는 입력칸 안에 넣을 수 있다.
// label태그는 글자를 클릭해도 체크가 되도록한다.

// onChange={e => onFilterTextChange(e.target.value)}
// 이거 콜백으로 안쓰면 (렌더링중에 호출) -> (filtered 텍스트 바뀜) -> (다시렌더) -> (또호출) : 무한루프
function SearchBar({filterText, inStockOnly, onFilterTextChange, onInStockOnlyChange}) {
  return (
    <form>
      <input
        type="text"
        value={filterText}
        onChange={e => onFilterTextChange(e.target.value)}
        placeholder="Search..."
      />
      <label>
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={e => onInStockOnlyChange(e.target.checked)}
        />{' '}
        Only show products in stock
      </label>
    </form>
  )
}

// App에서 왔음
// 일단 div내에 넣어서 만드네
// 상단에는 SearchBar
// 하단에는 ProductTable이 들어감 또 props로 넘겨줌
function FilterableProductTable({products}) {
  // 여기에 useState를 쓰는 이유 : 검색바와 물품목록의 LCA다
  const [filterText, setFilterText] = useState('')
  const [inStockOnly, setInStockOnly] = useState(false)

  // 결국 setState도 props로 내려줌
  return (
    <div>
      <SearchBar
        filterText={filterText}
        inStockOnly={inStockOnly}
        onFilterTextChange={setFilterText}
        onInStockOnlyChange={setInStockOnly}
      />
      <ProductTable
        products={products}
        filterText={filterText}
        inStockOnly={inStockOnly}
      />
    </div>
  )
}

// 얘는 데이터
const PRODUCTS = [
  {category: 'Fruits', price: '$1', stocked: true, name: 'Apple'},
  {category: 'Fruits', price: '$1', stocked: true, name: 'Dragonfruit'},
  {category: 'Fruits', price: '$2', stocked: false, name: 'Passionfruit'},
  {category: 'Vegetables', price: '$2', stocked: true, name: 'Spinach'},
  {category: 'Vegetables', price: '$4', stocked: false, name: 'Pumpkin'},
  {category: 'Vegetables', price: '$1', stocked: true, name: 'Peas'}
]

// 여기가 메인 App이 될것; FilterableProductTable에 props로 PRODUCT데이터를 넘겨줌
export default function App() {
  return <FilterableProductTable products={PRODUCTS} />
}
