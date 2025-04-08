import {useReducer} from 'react'

// State라는 인터페이스는 count라는 숫자 속성을 가짐
interface State {
  count: number
}

// CounterAction이라는 타입은 두 가지 액션을 정의
// 1. reset: 상태를 초기화하는 액션
// 2. setCount: count 값을 설정하는 액션
//    - value 속성은 State의 count 타입과 같음
type CounterAction = {type: 'reset'} | {type: 'setCount'; value: State['count']}

const initialState: State = {count: 0}

// stateReducer라는 함수는 상태와 액션을 받아서 새로운 상태를 반환
// 상태를 변경하는 로직을 정의
// 액션의 타입에 따라 상태를 변경하는 로직을 작성

function stateReducer(state: State, action: CounterAction): State {
  switch (action.type) {
    case 'reset':
      return initialState
    case 'setCount':
      // 여기서 state는 바로 덮어씌울수가 없으므로 새로운 객체로 복사하고
      // count : action.value로 덮어씌운다
      return {...state, count: action.value}
    default:
      throw new Error('Unknown action')
  }
}

// App은 최종 렌더링 되는 화면
// useReducer가 있다 state는 상태, dispatch는 상태를 변경하는 함수
// dispatch는 액션을 받아서 상태를 변경하는 역할
// useReducer는 상태를 관리하는 훅으로, 상태와 상태를 변경하는 함수를 반환
// useReducer는 상태를 변경하는 함수를 반환
export default function App() {
  const [state, dispatch] = useReducer(stateReducer, initialState)

  // dispatch를 사용하여 상태를 변경하는 함수
  const addFive = () => dispatch({type: 'setCount', value: state.count + 5})
  const reset = () => dispatch({type: 'reset'})

  return (
    <div>
      <h1>Welcome to my counter</h1>

      <p>Count: {state.count}</p>
      <button onClick={addFive}>Add 5</button>
      <button onClick={reset}>Reset</button>
    </div>
  )
}
