###############################################################################
# The makefile of jQuext framework
###############################################################################

SRC_DIR = src
DEMO_DIR = demo
BUILD_DIR = build

STYLES_DIR = ${SRC_DIR}/styles
STYLES_REFERS = $(shell ls -d ${STYLES_DIR}/*/)

JQ_INTRO = ${BUILD_DIR}/jquext-intro.js
JQ_OUTRO = ${BUILD_DIR}/jquext-outro.js

BASIC_JS_FILES = ${SRC_DIR}/jquext-core.js\
 	${SRC_DIR}/jquext-util.js\
 	${SRC_DIR}/jquext-loader.js\
 	${SRC_DIR}/jquext-validor.js\

ALL_JS_FILES = ${BASIC_JS_FILES}\
 	${SRC_DIR}/jquext-jquery.js\
 	${SRC_DIR}/jquext-widget.js\
 	${SRC_DIR}/jquext-button.js\
 	${SRC_DIR}/jquext-tabs.js\
 	${SRC_DIR}/jquext-table.js\
 	${SRC_DIR}/jquext-tree.js\
 	${SRC_DIR}/jquext-dialog.js\
 	${SRC_DIR}/jquext-calendar.js\
 	${SRC_DIR}/jquext-editor.js\
 	${SRC_DIR}/jquext-gmap.js

BASIC_JS_FILES_FULL = ${JQ_INTRO}\
	${BASIC_JS_FILES}\
	${JQ_OUTRO}

ALL_JS_FILES_FULL = ${JQ_INTRO}\
	${ALL_JS_FILES}\
	${JQ_OUTRO}

CSS_FILES = $(shell ls ${STYLES_DIR}/*.css)



DIST_DIR = dist
DIST_DEMO_DIR = ${DIST_DIR}
DIST_STYLES_DIR = ${DIST_DIR}/styles

JQ_DIST = ${DIST_DIR}/jquext-mini.js
JQ_MIN_DIST = ${DIST_DIR}/jquext.mini.min.js

JQ_ALL_DIST = ${DIST_DIR}/jquext-full.js
JQ_MIN_ALL_DIST = ${DIST_DIR}/jquext-full.min.js
JQ_STYLE_DIST = ${DIST_DIR}/styles/jquext-full.css
JQ_STYLE_MIN_DIST = ${DIST_DIR}/styles/jquext-full.min.css




JQ_DATE=$(shell date)
JQ_VER = $(shell cat version.txt)
JS_ENGINE ?= `which node nodejs 2>/dev/null`
COMPILER = ${JS_ENGINE} ${BUILD_DIR}/uglify.js --unsafe
POST_COMPILER = ${JS_ENGINE} ${BUILD_DIR}/post-compile.js

main: jquext jquext-hint jquext-min jquext-size
	@@echo "jQuext build complete."

jquext: ${JQ_DIST}  ${JQ_ALL_DIST} ${JQ_STYLE_DIST}

jquext-hint: jquext
	@@if test ! -z ${JS_ENGINE}; then \
		echo "Checking jQuext against JSHint..."; \
		${JS_ENGINE} build/jshint-check.js ${JQ_ALL_DIST}; \
	else \
		echo "You must have NodeJS installed in order to test jQuext against JSHint."; \
	fi

jquext-min: jquext ${JQ_MIN_DIST} ${JQ_MIN_ALL_DIST} ${JQ_STYLE_MIN_DIST}

jquext-size: jquext-min
	@@if test ! -z ${JS_ENGINE}; then \
		gzip -c ${JQ_MIN_ALL_DIST} > ${JQ_MIN_ALL_DIST}.gz; \
		wc -c ${JQ_ALL_DIST} ${JQ_MIN_ALL_DIST} ${JQ_MIN_ALL_DIST}.gz | \
		${JS_ENGINE} ${BUILD_DIR}/sizer.js 'jquext'; \
		rm ${JQ_MIN_ALL_DIST}.gz; \
	else \
		echo "You must have NodeJS installed in order to size jQuext."; \
	fi



${JQ_DIST}: ${BASIC_JS_FILES_FULL} | ${DIST_DIR}
	@@echo "Building" ${JQ_DIST}  

	@@cat ${BASIC_JS_FILES_FULL} | \
		sed 's/@DATE/'"${JQ_DATE}"'/' | \
		sed "s/@VERSION/${JQ_VER}/" > ${JQ_DIST};

${JQ_ALL_DIST}: ${ALL_JS_FILES_FULL} | ${DIST_DIR}
	@@echo "Building" ${JQ_ALL_DIST}  

	@@cat ${ALL_JS_FILES_FULL} | \
		sed 's/@DATE/'"${JQ_DATE}"'/' | \
		sed "s/@VERSION/${JQ_VER}/" > ${JQ_ALL_DIST};

${JQ_STYLE_DIST}: ${CSS_FILES} | ${DIST_STYLES_DIR}
	@@echo "Building" ${JQ_STYLE_DIST}

	@@cat ${CSS_FILES} > ${JQ_STYLE_DIST};
	
	@@cp -R ${STYLES_REFERS} ${DIST_STYLES_DIR}

${JQ_MIN_DIST}: ${JQ_DIST}
	@@if test ! -z ${JS_ENGINE}; then \
		echo "Creating" ${JQ_MIN_DIST}; \
		${COMPILER} ${JQ_DIST} > ${JQ_MIN_DIST}.tmp; \
		${POST_COMPILER} ${JQ_MIN_DIST}.tmp ${JQ_MIN_DIST} \
			"jQuext version @VERSION www.itsmesh.com license"; \
		rm -f ${JQ_MIN_DIST}.tmp; \
	else \
		echo "You must have NodeJS installed in order to minify jQuext."; \
	fi

${JQ_MIN_ALL_DIST}: ${JQ_ALL_DIST}
	@@if test ! -z ${JS_ENGINE}; then \
		echo "Creating" ${JQ_MIN_ALL_DIST}; \
		${COMPILER} ${JQ_ALL_DIST} > ${JQ_MIN_ALL_DIST}.tmp; \
		${POST_COMPILER} ${JQ_MIN_ALL_DIST}.tmp ${JQ_MIN_ALL_DIST} \
			"jQuext version @VERSION www.itsmesh.com license"; \
		rm -f ${JQ_MIN_ALL_DIST}.tmp; \
	else \
		echo "You must have NodeJS installed in order to minify jQuext."; \
	fi

${JQ_STYLE_MIN_DIST}: ${JQ_STYLE_DIST}
	@@echo "Creating" ${JQ_STYLE_MIN_DIST}
	
	@@java -jar ./build/lib/yuicompressor-2.4.7.jar \
		-o "${JQ_STYLE_MIN_DIST}" "${JQ_STYLE_DIST}"

${DIST_DIR}:
	@@mkdir -p ${DIST_DIR}

${DIST_STYLES_DIR}:
	@@mkdir -p ${DIST_STYLES_DIR}



freq: jquext-min
	@@if test ! -z ${JS_ENGINE}; then \
		${JS_ENGINE} ${BUILD_DIR}/freq.js ${JQ_MIN_ALL_DIST}; \
	else \
		echo "You must have NodeJS installed to report the character frequency of minified jQuext."; \
	fi

demo: jquext-min
	@@echo "Creating the demo file" $(shell ls ${DEMO_DIR}/*.htm)
	@@mkdir -p ${DIST_DEMO_DIR}
	
	@@java -jar ./build/lib/htmlcompressor-1.5.2.jar \
		--recursive --compress-js --compress-css \
		--type html -o ${DIST_DEMO_DIR}/ ${DEMO_DIR}/
	
	@@cp -f ${DEMO_DIR}/*.css ${DEMO_DIR}/*.js ${DIST_DEMO_DIR}/

clean:
	@@echo "Removing Distribution directory:" ${DIST_DIR}
	@@rm -rf ${DIST_DIR}


