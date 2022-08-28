import { Box } from '@react-three/drei'

const Page = (props) => {
  return (
    <>
      <Box
        onClick={() => {
          props.router.push('/page2')
        }}
      ></Box>

      {/*  */}
    </>
  )
}

Page.useCanvasLayout = true
async function getStaticProps() {
  return {
    props: {
      title: 'Effect Node Forge',
    },
  }
}

export { getStaticProps }
export default Page
